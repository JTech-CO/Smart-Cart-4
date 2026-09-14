# Sources / immutable snapshots

Reviewed on 2026-09-14. Manufacturer links identify design evidence, not approved procurement parts or an endorsement of this circuit. Vendor specifications remain conditional on the exact board and revision.

## [R1] Smart-Cart / model snapshot

https://github.com/JTech-CO/Smart-Cart/blob/2b4b8fea6909e4f76b4a52b02c5075c3f478097b/js/cart-model.js

## [R2] Smart-Cart-Wiring / B1 assembly conditions

https://github.com/JTech-CO/Smart-Cart-Wiring/blob/3ac3f1d793caba6494d27df6f0b9ba2eee8606d5/docs/ASSEMBLY-KR.md

## [R3] Smart-Cart-BOM / C1 procurement reconciliation

https://github.com/JTech-CO/Smart-Cart-BOM/blob/26c5061ff08912abb77f7fafcdc5e83a1018ac98/Smart-Cart-Procurement-BOM.md

## [S1] Pololu SMC G2 user guide

https://www.pololu.com/docs/0j77/all

## [S2] ESP32-DevKitC V4 / official pin and power guide

https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html

## [S3] Adafruit BNO085 #4754 / pinouts

https://learn.adafruit.com/adafruit-9-dof-orientation-imu-fusion-breakout-bno085/pinouts

## [S4] Pololu VL53L1X #3415 / connections

https://www.pololu.com/product/3415

## [S5] TI TCA9548A / Rev. H datasheet

https://www.ti.com/lit/ds/symlink/tca9548a.pdf

## [S6] Ai-Thinker BU04-Kit V1.1 / p.9 USB port identification

https://en.ai-thinker.com/Uploads/file/20241018/20241018150326_27432.pdf

## [S7] SLAMTEC RPLIDAR C1 / specifications

https://www.slamtec.com/ko/c1/spec

## [S8] Pilz / safety relay function

https://www.pilz.com/en-INT/support/lexicon/articles/072106

## [S9] Pilz / feedback loop monitoring

https://www.pilz.com/en-INT/support/lexicon/articles/074070

## [S10] TI ISO7721 / digital isolator

https://www.ti.com/product/ISO7721

## Reading record

GitHub connector reads were used for the three repository trees, the original model code, B1 assembly/terminal netlist, and the C1 procurement reconciliation. Relevant manufacturer pages were read online. The BU04-Kit USB-port diagram on printed page 9 (PDF page index 8) and the TCA9548A pin diagram (PDF index 3) were inspected as screenshots. No FreeCAD, STEP or measured assembly file was supplied.

New D2 supply, contactor, precharge, clamp, OVP and interface modules remain unselected functional blocks. The implementation never treats vendor documentation as a physical test of this cart.
