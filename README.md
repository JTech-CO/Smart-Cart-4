# Smart Cart D4.2

**D4.2 CAD fix:** Corrected the FCStd ZIP order that skipped all 998 new D4 shapes. Open [D4-only FCStd](cad/Smart-Cart-D4-Only.FCStd) for an unambiguous new assembly. See the [defect record](docs/CAD-DEFECT-D4.2-KR.md) and [current QA](docs/QA.md). Browser scenarios were user-confirmed; native FreeCAD execution of this repair remains unrun in this runtime.

English | [한국어](README-KR.md)

A self-contained static 3D assembly viewer, illustrated wiring viewer, data registers and placement-review CAD. Built from the supplied D4 files, the eight-part specification, servo photographs and prototype FreeCAD document. D4.1 restores missing runtime assets and documentation, removes stale counters, and adds reproducible regression checks. It does not approve fabrication or energization.

**Engineering release remains HOLD. The JDRV link remains physically OPEN pending power compatibility review.**

## Run

Extract the package, enter the folder containing `index.html`, then run:

```sh
python -m http.server 8000
```

Open `http://localhost:8000/index.html` (3D assembly) or `http://localhost:8000/wiring.html` (wiring). No npm, build step, CDN, API key or backend is required. Keep all relative paths intact when publishing the folder contents to a static host. Nothing is automatically pushed to GitHub.

The 3D page exposes only orbit/zoom/pan and component/conductor inspection. WebGL 2 uses materials/shadows; failed context creation falls back to interactive Canvas 2D projection of the same geometry. Rendering quality is not identical. The wiring page offers 14 illustrated sheets and 14 schematic sheets, selection, search/filter, SVG/CSV/JSON exports and manual checklist notes. 108 component references, 246 connection records and 379 registered functional terminals (378 wired plus one spare) are not a procurement count or individual conductor count.

## Review

[Regression results](docs/QA.md) · [Change log](docs/CHANGELOG.md) · [Engineering holds](docs/SAFETY-REVIEW-KR.md) · [Evidence and unresolved conflicts](docs/EVIDENCE-KR.md) · [Pin mapping](docs/PIN-MAP-KR.md) · [Sources](docs/SOURCES.md) · [CAD limitations](cad/README-KR.md)

The FCStd preserves the original 262 objects and adds 998 D4 BRep features. STEP and a rebuild macro are included. OpenCascade validation does not prove native FreeCAD GUI open/save, manufacturing dimensions, collision clearance, steering kinematics, stress capacity or electrical safety. Consult the QA report for actual executed vs unavailable tests.

## Reproduce

```sh
python tools/sync_data.py
node tests/static_regression.mjs
python tests/package_regression.py
python tests/browser_regression.py
python tests/cad_loader_regression.py
python tests/cad_regression.py
python tests/shader_regression.py
```

Browser tests require Python Playwright and Chromium (`CHROMIUM_PATH` can override its path). CAD tests require cadquery/OCP. Application runtime has no such dependencies. `--fixture` executes the unchanged shipped scripts in local browser documents when navigation is restricted; asset embedding and storage/export test doubles are explicitly recorded and are not native browser persistence/download tests.

Use `data/design.json` as the source of truth. `SHA256SUMS.txt` contains package file hashes. See [source notice](SOURCE-NOTICE.md); no new license is granted to upstream code or third-party imagery.

The optional shader test uses Linux EGL/OpenGL ES for source compilation/linking and test-triangle pixel checks. It is not execution of the browser WebGL renderer or a full-scene visual certification.

To rebuild the release after regression tests, run `python tools/package_release.py --output ../Smart-Cart-D4.2-Fixed.zip`. It writes an internal SHA-256 manifest, an external ZIP checksum and a separate archive-integrity report. See [QA](docs/QA.md) for 197 passed checks and five explicitly unexecuted environment-dependent checks; these are not fabrication or hardware-safety approval.
