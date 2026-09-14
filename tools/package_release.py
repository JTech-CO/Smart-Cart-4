#!/usr/bin/env python3
"""Build and verify an offline release ZIP. Does not publish or modify remote repos."""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
IGNORED = {'__pycache__', '.git', '.DS_Store'}


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(chunk)
    return digest.hexdigest()


def release_files() -> list[Path]:
    files = []
    for path in ROOT.rglob('*'):
        if any(part in IGNORED for part in path.relative_to(ROOT).parts):
            continue
        if path.is_symlink():
            raise ValueError(f'Symlinks are not allowed in release: {path}')
        if path.is_file() and path.suffix not in {'.pyc', '.pyo'}:
            files.append(path)
    return sorted(files, key=lambda p: p.relative_to(ROOT).as_posix())


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=ROOT.parent / 'Smart-Cart-D4-Final.zip')
    args = parser.parse_args()
    output = args.output.resolve()
    if output.is_relative_to(ROOT):
        raise ValueError('Output ZIP must be outside the source directory.')
    output.parent.mkdir(parents=True, exist_ok=True)
    checksum = ROOT / 'SHA256SUMS.txt'
    entries = [p for p in release_files() if p != checksum]
    manifest = {p.relative_to(ROOT).as_posix(): sha256_file(p) for p in entries}
    checksum.write_text(''.join(f'{digest}  {name}\n' for name, digest in manifest.items()), encoding='utf-8')
    entries = release_files()
    expected = {ROOT.name + '/' + p.relative_to(ROOT).as_posix(): p for p in entries}
    # Fixed timestamps and ordering make unchanged inputs reproducibly packageable.
    with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name, path in expected.items():
            info = zipfile.ZipInfo(name, date_time=(2026, 9, 14, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, path.read_bytes(), compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
    checks = []
    def check(name: str, result: bool, detail=None) -> None:
        checks.append({'name': name, 'status': 'PASS' if result else 'FAIL', 'detail': detail})
    with zipfile.ZipFile(output) as archive:
        names = archive.namelist()
        check('ZIP CRC and decompression', archive.testzip() is None)
        check('No duplicate entries', len(names) == len(set(names)))
        safe = all(not PurePosixPath(n).is_absolute() and '..' not in PurePosixPath(n).parts
                   and '\\' not in n and n.startswith(ROOT.name + '/') for n in names)
        check('Safe archive-relative paths', safe)
        check('Exact source file inventory', set(names) == set(expected), {'files': len(names)})
        digests = {n: hashlib.sha256(archive.read(n)).hexdigest() for n in names}
        mismatch = [n for n, path in expected.items() if digests.get(n) != sha256_file(path)]
        check('Every archive payload matches source SHA-256', not mismatch, mismatch)
        internal = {}
        for line in archive.read(ROOT.name + '/SHA256SUMS.txt').decode('utf-8').splitlines():
            digest, name = line.split('  ', 1)
            internal[name] = digest
        check('Every internal manifest hash matches archived payload',
              internal == manifest and all(digests.get(ROOT.name + '/' + n) == h for n, h in internal.items()),
              {'hashedFiles': len(internal)})
        if not safe:
            raise ValueError('Unsafe ZIP path found; extraction refused.')
        with tempfile.TemporaryDirectory(prefix='smart-cart-zip-') as temp:
            archive.extractall(temp)
            extracted = [p for p in Path(temp).rglob('*') if p.is_file()]
            mismatch = [n for n, digest in digests.items() if sha256_file(Path(temp) / n) != digest]
            check('Extraction round-trip hashes and count', not mismatch and len(extracted) == len(entries), mismatch)
    zip_hash = sha256_file(output)
    sidecar = output.with_name(output.name + '.sha256')
    sidecar.write_text(f'{zip_hash}  {output.name}\n', encoding='utf-8')
    check('External ZIP checksum matches final archive', sidecar.read_text().split('  ', 1)[0] == sha256_file(output))
    report = {'package': output.name, 'version': 'D4.1', 'rootDirectory': ROOT.name,
              'sha256': zip_hash, 'bytes': output.stat().st_size, 'files': len(entries),
              'uncompressedBytes': sum(p.stat().st_size for p in entries),
              'scope': 'Final ZIP integrity and extraction, not hardware or deployed-site certification.', 'checks': checks}
    verification = output.with_name(output.stem + '-Verification.json')
    verification.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if any(c['status'] != 'PASS' for c in checks):
        raise SystemExit('Release verification failed; do not distribute.')

if __name__ == '__main__':
    main()
