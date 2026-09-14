# ESP32 및 센서 핀 매핑

**ESP32-DevKitC V4 / WROOM-32E / 38핀 한정.** J2/J3는 Espressif 공식 V4 핀 표 기준이다. 30핀 클론, WROVER, 다른 DevKit에 그대로 적용하지 않는다. USB만 급전하고 5V/3.3V 외부 입력은 병렬 연결하지 않는다. [S2]

| ID | 출발 | 도착 | NET |
| --- | --- | --- | --- |
| W077 | `U1:J2.1_3V3` | `X3:3V3_IN` | `3V3` |
| W078 | `U1:J2.14_GND` | `X3:0V_IN` | `0V` |
| W091 | `U1:J3.9_IO18` | `IMU1:SCL_SCK` | `IMU_SCK` |
| W092 | `U1:J3.2_IO23` | `IMU1:DI_MOSI` | `IMU_MOSI` |
| W093 | `U1:J3.8_IO19` | `IMU1:SDA_MISO` | `IMU_MISO` |
| W094 | `U1:J2.11_IO27` | `IMU1:CS` | `IMU_CS` |
| W095 | `U1:J2.5_IO34` | `IMU1:INT` | `IMU_INT` |
| W096 | `U1:J2.7_IO32` | `IMU1:RST` | `IMU_RST` |
| W097 | `U1:J3.6_IO21` | `MUX1:SDA` | `SDA` |
| W098 | `U1:J3.3_IO22` | `MUX1:SCL` | `SCL` |
| W099 | `U1:J2.8_IO33` | `MUX1:RESET` | `MUX_RST` |
| W117 | `U1:J3.11_IO17` | `ISOL:A_IN` | `L_A_TX` |
| W118 | `ISOL:A_OUT` | `U1:J3.12_IO16` | `L_A_RX` |
| W123 | `U1:J2.9_IO25` | `ISOR:A_IN` | `R_A_TX` |
| W124 | `ISOR:A_OUT` | `U1:J2.10_IO26` | `R_A_RX` |

## 센서와 사용하지 않는 단자

BNO085 #4754는 SPI, P0/P1 HIGH다. 3Vo와 BT는 이번 외부 배선에서 사용하지 않는다. 센서 측 SCL은 SCK, DI는 MOSI, SDA는 MISO로 쓰인다. INT의 풀업은 실제 브레이크아웃 온보드 구성을 확인한다. [S3]

VL53L1X #3415는 VIN=3.3V, SDA/SCL만 사용한다. XSHUT, GPIO1, VDD는 NC다. MUX CH0/CH1은 한 번에 하나만 선택하고 CH2~CH7은 NC다. MUX RST는 GPIO33과 조건부 10kΩ 풀업, A0/A1/A2는 GND다. [S4][S5]

X3는 3.3V와 0V가 분리된 단자군이다. 서로 다른 이름의 입력/출력이 같은 전압 레일을 가질 수 있지만 두 전압군은 합치지 않는다. 부품에 내장된 풀업과 RP_SDA/RP_SCL/RP_RST/RP_INT가 중복인지 확인한다.

ISOL/ISOR는 소자 핀 배치가 아닌 완성 인터페이스 모듈의 기능 포트다. A 측은 ESP32 3.3V/0V, B 측은 각각 MDL/MDR의 확인된 3.3V BEC/GND다. 드라이버 VM 또는 5V 점퍼로 바꾸지 않는다. [S1][S10]

## USB / OEM 케이블

| 경로 | 연결 |
| --- | --- |
| HOST | Orange Pi HOST → 허브 UP |
| P1 | 허브 → ESP32 micro-USB |
| P2 | 허브 → C1 전용 USB 어댑터 → OEM C1 하네스 |
| P3 | 허브 → UWB L ranging USB |
| P4 | 허브 → UWB R ranging USB |

이 표는 USB 케이블 내부 D+/D−의 납땜 지시가 아니다. 완성 케이블과 제조사 전용 하네스를 사용한다. BU04-Kit 문서의 ⑦ ranging 포트와 ⑧ AT 포트를 구분한다. 사용자 태그는 독립 전원이다. [S6]

## 안전/전력 단자

`SR1:TEST_A`, `SR1:EDM_OUT`, `K1:EDM_IN`, `PPL:OUT+`, `CLL:+`, `BT1:CHG+` 등은 기능 포트 이름이다. 이를 범용 제품의 인쇄 단자 번호로 해석하지 않는다. 제품별 제조사 결선도와 대조해 물리 단자 매핑을 추가하고 검토자를 지정해야 한다.

전체 기준은 [결선표](../data/point-to-point.csv)와 [안전 설계 검토](SAFETY-REVIEW-KR.md)이다. 위 [S#]는 [출처](SOURCES.md)의 번호다.
