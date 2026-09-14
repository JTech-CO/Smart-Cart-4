# D4.2 FCStd load-order repair

Open **[Smart-Cart-D4-Only.FCStd](Smart-Cart-D4-Only.FCStd)** for the new D4 assembly without any prototype objects. [Smart-Cart-D4.FCStd](Smart-Cart-D4.FCStd) preserves the original prototype as a hidden reference. The web application, electrical topology, shape geometry and existing STEP are unchanged.

The old FCStd appended 998 new BRep payloads after `GuiDocument.xml`. FreeCAD's `Base::XMLReader::readFiles` uses a forward-only registration cursor and a nested GUI reader. A source-aligned replay restores 0/998 D4 shapes from the old order and 998/998 from the repaired order. ZIP CRC, XML reference presence and standalone BRep validity did not detect this error.

The repaired physical archive order is Document.xml, all registered application payloads, GuiDocument.xml, optional thumbnail, then registered GUI payloads. All 998 D4 BReps, and all 249 original BReps in the combined variant, are byte-identical to the source. The startup camera is centered on the D4 bounds. Its thumbnail is a web preview, not evidence of a FreeCAD GUI run.

The D4-only document has 1004 objects (998 Part features and six groups). The combined document has 1267 objects. D4 contains 4664 solids; nine cover solids are initially hidden. The unchanged STEP contains the 4655 non-cover solids.

`Verify-D4-Native.FCMacro` is an optional FreeCAD-side open/save/reopen check. Select a closed source file; it validates loaded shapes, writes a uniquely named copy, reopens it and records JSON. It does not overwrite the source or close unrelated documents. `Rebuild-D4.FCMacro` remains an independent BRep import recovery path.

**Native FreeCAD GUI execution was not available in the assistant runtime.** The repaired file has not been certified by a native FreeCAD 1.1.3 open/save test. The user separately confirmed the four browser scenarios; that is not an assistant-run test. See [QA](../docs/QA.md) and the [Korean guide](README-KR.md).

ENGINEERING HOLD and JDRV OPEN remain. This is a static Part::Feature placement assembly, not a fully constrained manufacturing model or hardware safety approval.
