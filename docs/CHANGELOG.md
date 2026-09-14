# Change log

## D4.1 - final package regression revision

- Restored 14 document-image references, four supplied servo images, favicon and `.nojekyll`.
- Replaced stale 77/179/0.865m and 12-gate UI counters with 108/246/0.862m and 11 gates read from shared design data.
- Removed the obsolete official J2/J3 pin-number assertion from the WROOM-32U component inspector; retained functional GPIO names and verified GND requirement.
- Corrected inherited LiDAR adapter location wording to the existing tray-mounted model; geometry and circuit topology were not changed.
- Hardened manual checklist loading for invalid JSON, null, arrays and unknown IDs. User content remains escaped. Storage failure is reported without blocking export.
- Added keyboard pan/zoom/reset/clear to the wiring canvas; neutralized stale selection styling in exported SVGs.
- Regenerated CSV mirrors and the full 28-sheet SVG set from the shared data.
- Added source/evidence/CAD/run instructions, test scripts, QA logs and checksums. Restored the unmodified prototype FCStd alongside the D4 document.
- Kept JDRV OPEN, all 11 engineering holds, unresolved physical ratings and dimensional conflicts. No firmware, fabrication approval, live control, topology change or remote Git commit was added.

The detailed executed test matrix and environmental limitations are in [QA.md](QA.md). Earlier D2/D3 test results are not reused as D4.1 passes.

- Recorded X12:SIG0 as a spare 0V terminal with no external conductor, not an isolated NC. No new wire was silently added.
- Documented the STEP open-service export policy: COVER is retained in FCStd but excluded from STEP. Regression compares matching scopes instead of misreporting the deliberate nine-solid difference as data loss.

- Invalid wiring deep-link IDs now clear selection without unexpectedly switching to the overview sheet.
- Browser CSV export now uses the same column order and labels as the packaged point-to-point.csv.
- The FreeCAD rebuild macro explicitly imports the GUI module, validates BRep names/shapes, uses a new document, and asks for a save location rather than silently overwriting the package. Native macro execution remains untested here.
