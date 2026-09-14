'use strict';
window.CartDesign = {
  "revision": "D3",
  "date": "2026-09-14",
  "release": "HOLD",
  "title": "Smart Cart / Electrical Integration",
  "baseline": "후륜 독립 구동 + 전륜 개별 서보 조향 / ToF 전방 / 전면 상단 레일 LiDAR",
  "sources": [
    {
      "id": "R1",
      "title": "Smart-Cart / model snapshot",
      "url": "https://github.com/JTech-CO/Smart-Cart/blob/2b4b8fea6909e4f76b4a52b02c5075c3f478097b/js/cart-model.js"
    },
    {
      "id": "R2",
      "title": "Smart-Cart-Wiring / B1 assembly conditions",
      "url": "https://github.com/JTech-CO/Smart-Cart-Wiring/blob/3ac3f1d793caba6494d27df6f0b9ba2eee8606d5/docs/ASSEMBLY-KR.md"
    },
    {
      "id": "R3",
      "title": "Smart-Cart-BOM / C1 procurement reconciliation",
      "url": "https://github.com/JTech-CO/Smart-Cart-BOM/blob/26c5061ff08912abb77f7fafcdc5e83a1018ac98/Smart-Cart-Procurement-BOM.md"
    },
    {
      "id": "S1",
      "title": "Pololu SMC G2 user guide",
      "url": "https://www.pololu.com/docs/0j77/all"
    },
    {
      "id": "S2",
      "title": "ESP32-DevKitC V4 / official pin and power guide",
      "url": "https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html"
    },
    {
      "id": "S3",
      "title": "Adafruit BNO085 #4754 / pinouts",
      "url": "https://learn.adafruit.com/adafruit-9-dof-orientation-imu-fusion-breakout-bno085/pinouts"
    },
    {
      "id": "S4",
      "title": "Pololu VL53L1X #3415 / connections",
      "url": "https://www.pololu.com/product/3415"
    },
    {
      "id": "S5",
      "title": "TI TCA9548A / Rev. H datasheet",
      "url": "https://www.ti.com/lit/ds/symlink/tca9548a.pdf"
    },
    {
      "id": "S6",
      "title": "Ai-Thinker BU04-Kit V1.1 / p.9 USB port identification",
      "url": "https://en.ai-thinker.com/Uploads/file/20241018/20241018150326_27432.pdf"
    },
    {
      "id": "S7",
      "title": "SLAMTEC RPLIDAR C1 / specifications",
      "url": "https://www.slamtec.com/ko/c1/spec"
    },
    {
      "id": "S8",
      "title": "Pilz / safety relay function",
      "url": "https://www.pilz.com/en-INT/support/lexicon/articles/072106"
    },
    {
      "id": "S9",
      "title": "Pilz / feedback loop monitoring",
      "url": "https://www.pilz.com/en-INT/support/lexicon/articles/074070"
    },
    {
      "id": "S10",
      "title": "TI ISO7721 / digital isolator",
      "url": "https://www.ti.com/product/ISO7721"
    },
    {
      "id": "R4",
      "title": "Smart-Cart-2 / inspected D2 snapshot",
      "url": "https://github.com/JTech-CO/Smart-Cart-2/tree/cf2a2bd5bced9a97989de4bb2a884ecbb5e389a2"
    },
    {
      "id": "S11",
      "title": "TI ISO7720 / dual forward channels, F default-low option",
      "url": "https://www.ti.com/product/ISO7720"
    },
    {
      "id": "S12",
      "title": "TI ISO772x Rev.G / pin configuration and supply decoupling",
      "url": "https://www.ti.com/lit/ds/symlink/iso7720.pdf"
    },
    {
      "id": "S13",
      "title": "DSSERVO official website / exact RDS51150 revision still unverified",
      "url": "https://www.dsservo.com/"
    }
  ],
  "components": [
    {
      "id": "BT1",
      "name": "배터리 + BMS",
      "subtitle": "24V class / 108Ah 요구",
      "kind": "battery",
      "group": "power",
      "position": [
        0,
        0.178,
        -0.07
      ],
      "ports": {
        "+": "BAT+",
        "-": "0V",
        "CHG+": "CHG+",
        "CHG-": "CHG-"
      },
      "notes": "화학계·셀 수·BMS 실모델 미확정. 8S LiFePO4 25.6V/29.2V는 검토 시나리오이며 실물 확정값이 아님. CHG 단자는 BMS 제조사 지정 충전 포트의 기능명이다. 배터리 내부 셀/BMS 조립 지시가 아니다. 외형은 기존 모델의 임시 공간.",
      "status": "hold",
      "source": [
        "R2",
        "R3"
      ],
      "delta": "유지",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "F0",
      "name": "메인 DC 퓨즈",
      "subtitle": "배터리 + 단자 인접",
      "kind": "fuse",
      "group": "power",
      "position": [
        -0.08,
        0.33,
        -0.19
      ],
      "ports": {
        "IN": "BAT+",
        "OUT": "BAT_FUSED"
      },
      "notes": "배터리 단자에 최대한 근접한 절연 홀더. DC 정격전압·예상 단락전류 차단용량·전선 허용전류·시간전류곡선 모두 승인 전 정격 A 미정. 기존 숫자를 그대로 사용하지 않는다.",
      "status": "hold",
      "source": [
        "R2",
        "R3"
      ],
      "delta": "재선정",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "S0",
      "name": "주전원 차단기",
      "subtitle": "DC 부하 개폐 / 잠금",
      "kind": "switch",
      "group": "power",
      "position": [
        -0.24,
        0.367,
        -0.445
      ],
      "ports": {
        "IN": "BAT_FUSED",
        "OUT": "BUS24"
      },
      "notes": "정비용 배터리 분리. 모든 양극 분기보다 상류. 충전 포트는 별도 배터리 포트이므로 S0 OFF만으로 충전 포트까지 무전압이 되지 않는다.",
      "status": "hold",
      "source": [
        "R2"
      ],
      "delta": "유지",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "X24",
      "name": "절연 + 분배 블록",
      "subtitle": "구동 / 보조전원 분기",
      "kind": "terminal",
      "group": "power",
      "position": [
        -0.25,
        0.36,
        -0.26
      ],
      "ports": {
        "IN": "BUS24",
        "DRIVE": "BUS24",
        "AUX24": "BUS24",
        "AUX5": "BUS24"
      },
      "notes": "배터리전압 버스. 24V라는 이름은 정전압 의미가 아니다. 터치 방지 커버·단자 허용전류·토크 필요.",
      "status": "hold",
      "source": [
        "R2"
      ],
      "delta": "유지",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "X0",
      "name": "0V 스타 분배 블록",
      "subtitle": "전력 귀환 / 신호 귀환 구분",
      "kind": "terminal",
      "group": "power",
      "position": [
        -0.25,
        0.36,
        -0.08
      ],
      "ports": {
        "BAT": "0V",
        "ML": "0V",
        "MR": "0V",
        "DC1": "0V",
        "DC2": "0V",
        "SR": "0V",
        "K1": "0V",
        "K2": "0V",
        "STEER": "0V"
      },
      "notes": "배터리 -에 개별 전력 귀환. 프레임은 전류 귀환선으로 사용하지 않는다. 신호선·USB 실드로 모터 전류를 흘리지 않는다. 비절연 DC-DC 및 공통 0V 기준이며 시스템 전체의 갈바닉 절연을 의미하지 않는다.",
      "status": "review",
      "source": [
        "R2"
      ],
      "delta": "유지",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "K1",
      "name": "주접촉기 1",
      "subtitle": "DC NO + 검증된 미러 NC",
      "kind": "contactor",
      "group": "safety",
      "position": [
        -0.185,
        0.385,
        -0.31
      ],
      "ports": {
        "L1": "BUS24",
        "T1": "K_MID",
        "A1": "K1_COIL",
        "A2": "0V",
        "EDM_IN": "EDM_START",
        "EDM_OUT": "EDM_MID"
      },
      "notes": "두 주접점은 직렬. 24V 코일로 변경하는 D2 제안. DC 차단능력·양방향 전류·자석 극성·기계 수명·미러 NC의 제조사 적합성을 확인한다. 일반 보조 NC를 미러 접점으로 간주하지 않는다. EDM_IN/OUT은 기능명, 실단자 번호 미정.",
      "status": "hold",
      "source": [
        "S8",
        "S9"
      ],
      "delta": "교체",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "Z1",
      "name": "코일 억제기 1",
      "subtitle": "K1 제조사 지정",
      "kind": "suppressor",
      "group": "safety",
      "position": [
        -0.185,
        0.375,
        -0.255
      ],
      "ports": {
        "+": "K1_COIL",
        "-": "0V"
      },
      "notes": "코일 제조사 지정 억제기. 단순 다이오드를 임의 병렬하면 차단 지연이 달라진다. 설치 극성과 실제 탈락시간 검증.",
      "status": "hold",
      "source": [
        "R2"
      ],
      "delta": "재선정",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "K2",
      "name": "주접촉기 2",
      "subtitle": "DC NO + 검증된 미러 NC",
      "kind": "contactor",
      "group": "safety",
      "position": [
        -0.105,
        0.385,
        -0.31
      ],
      "ports": {
        "L1": "K_MID",
        "T1": "DRIVE24",
        "A1": "K2_COIL",
        "A2": "0V",
        "EDM_IN": "EDM_MID",
        "EDM_OUT": "EDM_END"
      },
      "notes": "두 주접점은 직렬. 24V 코일로 변경하는 D2 제안. DC 차단능력·양방향 전류·자석 극성·기계 수명·미러 NC의 제조사 적합성을 확인한다. 일반 보조 NC를 미러 접점으로 간주하지 않는다. EDM_IN/OUT은 기능명, 실단자 번호 미정. D3의 조향 전원 F11도 T1 하류에서 분기. 접점 개방 후 회생/잔류에너지 때문에 하류가 즉시 무전압이라고 가정하지 않는다.",
      "status": "hold",
      "source": [
        "S8",
        "S9"
      ],
      "delta": "추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "Z2",
      "name": "코일 억제기 2",
      "subtitle": "K2 제조사 지정",
      "kind": "suppressor",
      "group": "safety",
      "position": [
        -0.105,
        0.375,
        -0.255
      ],
      "ports": {
        "+": "K2_COIL",
        "-": "0V"
      },
      "notes": "코일 제조사 지정 억제기. 단순 다이오드를 임의 병렬하면 차단 지연이 달라진다. 설치 극성과 실제 탈락시간 검증.",
      "status": "hold",
      "source": [
        "R2"
      ],
      "delta": "추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "F1",
      "name": "L 구동 분기 퓨즈",
      "subtitle": "드라이버 입력 보호",
      "kind": "fuse",
      "group": "power",
      "position": [
        -0.205,
        0.345,
        -0.17
      ],
      "ports": {
        "IN": "DRIVE24",
        "OUT": "FUSED_L"
      },
      "notes": "정격 A 미확정. SMC G2 포함 단자대의 제조사 안내가 15/16A로 달라 최대 15A 측으로 보수 검토. 25A 퓨즈를 해당 단자대에 무조건 적용 금지. 모터 전류 제한은 별도로 설정.",
      "status": "hold",
      "source": [
        "S1",
        "R2"
      ],
      "delta": "재선정",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "PPL",
      "name": "프리차지 L",
      "subtitle": "저항 + 정상운전 바이패스",
      "kind": "precharge",
      "group": "power",
      "position": [
        -0.205,
        0.351,
        -0.1
      ],
      "ports": {
        "IN+": "FUSED_L",
        "OUT+": "LINK_L",
        "0V": "0V"
      },
      "notes": "독립 완성 모듈/전장 조립체 기능 인터페이스. K1/K2 하류에만 배치. 저항 에너지·바이패스 고착·완료 확인·전원 소실 동작·회생 호환을 검증. 모터 허가는 프리차지 완료 후. 실모델·내부 회로/제어 미확정이므로 통전 보류.",
      "status": "hold",
      "source": [
        "S1"
      ],
      "delta": "추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "MDL",
      "name": "L 모터 드라이버",
      "subtitle": "SMC G2 24v19 / 조건부",
      "kind": "driver",
      "group": "drive",
      "position": [
        -0.205,
        0.352,
        -0.02
      ],
      "ports": {
        "VIN": "LINK_L",
        "GND": "0V",
        "OUTA": "ML_A",
        "OUTB": "ML_B",
        "RX": "UART_L_RX",
        "TX": "UART_L_TX",
        "3V3_BEC": "DRV_L_3V3"
      },
      "notes": "6.5~40V 동작 범위의 후보. 19A 표기만으로 실제 지속/스톨 전류를 승인하지 않는다. 접속부·방열·전류 제한 검증. 3V3_BEC는 확인된 3.3V 패드만 사용; 5V 선택 점퍼와 혼동 금지. 주행 구성에서 드라이버 USB는 연결하지 않는다. OUTA/B는 둘 다 H브리지 출력이다.",
      "status": "hold",
      "source": [
        "S1",
        "R3"
      ],
      "delta": "유지",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "CLL",
      "name": "DC 링크 흡수기 L",
      "subtitle": "능동 클램프 + 제동저항",
      "kind": "clamp",
      "group": "drive",
      "position": [
        -0.205,
        0.353,
        0.06
      ],
      "ports": {
        "+": "LINK_L",
        "-": "0V"
      },
      "notes": "각 드라이버의 동일 VIN/GND에 짧게 병렬. 퓨즈/접촉기/프리차지 상류에만 달면 단절 시 보호하지 못한다. BMS 충전 거부·완충·퓨즈 단선 후에도 로컬 링크 에너지를 흡수해야 한다. 임계전압·오버슈트·저항 J/W·온도차단 미확정. TVS 단독으로 대체 불가.",
      "status": "hold",
      "source": [
        "S1",
        "R2"
      ],
      "delta": "추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "RBL",
      "name": "링크 잔류전압 방전 L",
      "subtitle": "저항 / 측정점",
      "kind": "resistor",
      "group": "drive",
      "position": [
        -0.16999999999999998,
        0.354,
        0.065
      ],
      "ports": {
        "+": "LINK_L",
        "-": "0V"
      },
      "notes": "정격은 C와 방전시간에서 계산. t=R*C*ln(V0/Vsafe), 정상손실 P=V²/R. 부품 내장 여부 확인 후 중복 제외. 방전 완료는 측정으로 확인.",
      "status": "hold",
      "source": [
        "S1"
      ],
      "delta": "추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "ML",
      "name": "L 감속모터",
      "subtitle": "24V 250W / 브러시 DC 확인",
      "kind": "motor",
      "group": "drive",
      "position": [
        -0.251,
        0.171,
        -0.255
      ],
      "ports": {
        "A": "ML_A",
        "B": "ML_B"
      },
      "notes": "브러시 DC 실모델·스톨전류·감속비·브레이크·엔코더 유무 미확정. BLDC를 같은 회로에 연결할 수 없다. 극성을 바꾸면 회전방향이 달라짐; A/B 모두 차체·0V 접속 금지.",
      "status": "hold",
      "source": [
        "R1",
        "R3"
      ],
      "delta": "유지",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "CML",
      "name": "모터 노이즈 억제 L",
      "subtitle": "A-B 간 비극성 커패시터",
      "kind": "capacitor",
      "group": "drive",
      "position": [
        -0.251,
        0.196,
        -0.155
      ],
      "ports": {
        "1": "ML_A",
        "2": "ML_B"
      },
      "notes": "제조사가 허용하는 경우 모터 단자 바로 옆 비극성 0.1µF 검토. 전압·펄스 정격 확인. 전해 커패시터나 단방향 다이오드를 가역 모터 A/B에 임의 병렬하지 않는다.",
      "status": "review",
      "source": [
        "S1"
      ],
      "delta": "추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "F2",
      "name": "R 구동 분기 퓨즈",
      "subtitle": "드라이버 입력 보호",
      "kind": "fuse",
      "group": "power",
      "position": [
        -0.075,
        0.345,
        -0.17
      ],
      "ports": {
        "IN": "DRIVE24",
        "OUT": "FUSED_R"
      },
      "notes": "정격 A 미확정. SMC G2 포함 단자대의 제조사 안내가 15/16A로 달라 최대 15A 측으로 보수 검토. 25A 퓨즈를 해당 단자대에 무조건 적용 금지. 모터 전류 제한은 별도로 설정.",
      "status": "hold",
      "source": [
        "S1",
        "R2"
      ],
      "delta": "재선정",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "PPR",
      "name": "프리차지 R",
      "subtitle": "저항 + 정상운전 바이패스",
      "kind": "precharge",
      "group": "power",
      "position": [
        -0.075,
        0.351,
        -0.1
      ],
      "ports": {
        "IN+": "FUSED_R",
        "OUT+": "LINK_R",
        "0V": "0V"
      },
      "notes": "독립 완성 모듈/전장 조립체 기능 인터페이스. K1/K2 하류에만 배치. 저항 에너지·바이패스 고착·완료 확인·전원 소실 동작·회생 호환을 검증. 모터 허가는 프리차지 완료 후. 실모델·내부 회로/제어 미확정이므로 통전 보류.",
      "status": "hold",
      "source": [
        "S1"
      ],
      "delta": "추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "MDR",
      "name": "R 모터 드라이버",
      "subtitle": "SMC G2 24v19 / 조건부",
      "kind": "driver",
      "group": "drive",
      "position": [
        -0.075,
        0.352,
        -0.02
      ],
      "ports": {
        "VIN": "LINK_R",
        "GND": "0V",
        "OUTA": "MR_A",
        "OUTB": "MR_B",
        "RX": "UART_R_RX",
        "TX": "UART_R_TX",
        "3V3_BEC": "DRV_R_3V3"
      },
      "notes": "6.5~40V 동작 범위의 후보. 19A 표기만으로 실제 지속/스톨 전류를 승인하지 않는다. 접속부·방열·전류 제한 검증. 3V3_BEC는 확인된 3.3V 패드만 사용; 5V 선택 점퍼와 혼동 금지. 주행 구성에서 드라이버 USB는 연결하지 않는다. OUTA/B는 둘 다 H브리지 출력이다.",
      "status": "hold",
      "source": [
        "S1",
        "R3"
      ],
      "delta": "유지",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "CLR",
      "name": "DC 링크 흡수기 R",
      "subtitle": "능동 클램프 + 제동저항",
      "kind": "clamp",
      "group": "drive",
      "position": [
        -0.075,
        0.353,
        0.06
      ],
      "ports": {
        "+": "LINK_R",
        "-": "0V"
      },
      "notes": "각 드라이버의 동일 VIN/GND에 짧게 병렬. 퓨즈/접촉기/프리차지 상류에만 달면 단절 시 보호하지 못한다. BMS 충전 거부·완충·퓨즈 단선 후에도 로컬 링크 에너지를 흡수해야 한다. 임계전압·오버슈트·저항 J/W·온도차단 미확정. TVS 단독으로 대체 불가.",
      "status": "hold",
      "source": [
        "S1",
        "R2"
      ],
      "delta": "추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "RBR",
      "name": "링크 잔류전압 방전 R",
      "subtitle": "저항 / 측정점",
      "kind": "resistor",
      "group": "drive",
      "position": [
        -0.039999999999999994,
        0.354,
        0.065
      ],
      "ports": {
        "+": "LINK_R",
        "-": "0V"
      },
      "notes": "정격은 C와 방전시간에서 계산. t=R*C*ln(V0/Vsafe), 정상손실 P=V²/R. 부품 내장 여부 확인 후 중복 제외. 방전 완료는 측정으로 확인.",
      "status": "hold",
      "source": [
        "S1"
      ],
      "delta": "추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "MR",
      "name": "R 감속모터",
      "subtitle": "24V 250W / 브러시 DC 확인",
      "kind": "motor",
      "group": "drive",
      "position": [
        0.251,
        0.171,
        -0.255
      ],
      "ports": {
        "A": "MR_A",
        "B": "MR_B"
      },
      "notes": "브러시 DC 실모델·스톨전류·감속비·브레이크·엔코더 유무 미확정. BLDC를 같은 회로에 연결할 수 없다. 극성을 바꾸면 회전방향이 달라짐; A/B 모두 차체·0V 접속 금지.",
      "status": "hold",
      "source": [
        "R1",
        "R3"
      ],
      "delta": "유지",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "CMR",
      "name": "모터 노이즈 억제 R",
      "subtitle": "A-B 간 비극성 커패시터",
      "kind": "capacitor",
      "group": "drive",
      "position": [
        0.251,
        0.196,
        -0.155
      ],
      "ports": {
        "1": "MR_A",
        "2": "MR_B"
      },
      "notes": "제조사가 허용하는 경우 모터 단자 바로 옆 비극성 0.1µF 검토. 전압·펄스 정격 확인. 전해 커패시터나 단방향 다이오드를 가역 모터 A/B에 임의 병렬하지 않는다.",
      "status": "review",
      "source": [
        "S1"
      ],
      "delta": "추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "F3",
      "name": "안전전원 입력 퓨즈",
      "subtitle": "배터리 버스 분기",
      "kind": "fuse",
      "group": "power",
      "position": [
        0.015,
        0.344,
        -0.4
      ],
      "ports": {
        "IN": "BUS24",
        "OUT": "DC1_IN"
      },
      "notes": "DC1 입력 배선과 기동전류에 따라 정격 확정.",
      "status": "hold",
      "source": [
        "R2"
      ],
      "delta": "재선정",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "DC1",
      "name": "안전전원 DC-DC",
      "subtitle": "18~60V 입력 목표 → 24V",
      "kind": "converter",
      "group": "safety",
      "position": [
        0.04,
        0.351,
        -0.31
      ],
      "ports": {
        "IN+": "DC1_IN",
        "IN-": "0V",
        "OUT+": "SAFE24",
        "OUT-": "0V"
      },
      "notes": "B1의 12V/20A 서보·코일 전원과 다름. D2는 24V 안전릴레이/코일용 정전압 buck-boost로 교체 제안. 실제 연속 출력, 입력 최저/최고, OVP 및 두 코일 동시 투입/탈락 조건을 확인. 24V 배터리를 직접 24V 릴레이에 넣지 않는다.",
      "status": "hold",
      "source": [
        "R2",
        "S8"
      ],
      "delta": "교체",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "F9",
      "name": "안전전원 출력 퓨즈",
      "subtitle": "SR1 + 코일 전원",
      "kind": "fuse",
      "group": "safety",
      "position": [
        0.04,
        0.35,
        -0.225
      ],
      "ports": {
        "IN": "SAFE24",
        "OUT": "SAFE24_F"
      },
      "notes": "SR1 및 코일 합산 입력·배선에 맞춰 정격 결정.",
      "status": "hold",
      "source": [
        "R2"
      ],
      "delta": "재선정",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "SR1",
      "name": "이중 채널 안전릴레이",
      "subtitle": "교차단락 감시 / EDM / 수동 리셋",
      "kind": "safety",
      "group": "safety",
      "position": [
        0.03,
        0.389,
        -0.15
      ],
      "ports": {
        "24V": "SAFE24_F",
        "0V": "0V",
        "TEST_A": "ESTOP_A_OUT",
        "RETURN_A": "ESTOP_A_IN",
        "TEST_B": "ESTOP_B_OUT",
        "RETURN_B": "ESTOP_B_IN",
        "RESET_OUT": "RESET_OUT",
        "RESET_IN": "RESET_IN",
        "EDM_OUT": "EDM_START",
        "EDM_IN": "EDM_END",
        "O1_FEED": "SAFE24_F",
        "O1": "K1_COIL",
        "O2_FEED": "SAFE24_F",
        "O2": "K2_COIL"
      },
      "notes": "완성 안전릴레이 기능 인터페이스이며 실물 핀맵이 아님. 두 NC 채널·단락 감시·리셋 에지 감시·EDM을 지원하는 정확한 모델과 제조사 결선도 확정 필요. 임의 타이머/일반 릴레이로 대체 금지. 이 도면 자체는 PL/SIL 인증이 아니다.",
      "status": "hold",
      "source": [
        "S8",
        "S9"
      ],
      "delta": "추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "S1",
      "name": "비상정지",
      "subtitle": "직접 개방 동작 · NC 2접점",
      "kind": "estop",
      "group": "safety",
      "position": [
        -0.17,
        0.987,
        -0.627
      ],
      "ports": {
        "A_IN": "ESTOP_A_OUT",
        "A_OUT": "ESTOP_A_IN",
        "B_IN": "ESTOP_B_OUT",
        "B_OUT": "ESTOP_B_IN"
      },
      "notes": "후면 손잡이 접근 위치. 비상정지 신호는 ESP32를 경유하지 않는다. 접점/배선의 물리적 독립성 및 단락 감시 시험. 해제만으로 구동 재인가하지 않는다. 접점 번호는 실물 확정 전 기능명.",
      "status": "hold",
      "source": [
        "S8"
      ],
      "delta": "교체",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "S2",
      "name": "수동 리셋",
      "subtitle": "순간 NO / 리셋 에지 감시",
      "kind": "button",
      "group": "safety",
      "position": [
        0.17,
        0.987,
        -0.627
      ],
      "ports": {
        "IN": "RESET_OUT",
        "OUT": "RESET_IN"
      },
      "notes": "SR1의 감시형 수동 리셋에만 연결. 모터 속도 명령/운전 시작 버튼이 아님. 고정 눌림·용착 상태에서 자동 재기동하지 않는지 검증.",
      "status": "hold",
      "source": [
        "S8"
      ],
      "delta": "변경",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "F4",
      "name": "5V 컨버터 입력 퓨즈",
      "subtitle": "배터리 버스 분기",
      "kind": "fuse",
      "group": "power",
      "position": [
        0.12,
        0.344,
        -0.4
      ],
      "ports": {
        "IN": "BUS24",
        "OUT": "DC2_IN"
      },
      "notes": "DC2의 입력전류·기동 부하·배선 단면과 조정.",
      "status": "hold",
      "source": [
        "R2"
      ],
      "delta": "유지",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "DC2",
      "name": "제어전원 DC-DC",
      "subtitle": "18~60V 입력 목표 → 5.0V / 10A",
      "kind": "converter",
      "group": "compute",
      "position": [
        0.175,
        0.351,
        -0.33
      ],
      "ports": {
        "IN+": "DC2_IN",
        "IN-": "0V",
        "OUT+": "5V_RAW",
        "OUT-": "0V"
      },
      "notes": "5V/10A는 전원 용량 목표, 부하가 강제로 10A를 받는다는 뜻이 아님. 실제 지속 출력·열저감·과도 응답 확인. SBC/허브는 브레드보드 급전 금지.",
      "status": "hold",
      "source": [
        "R2"
      ],
      "delta": "유지",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "OV5",
      "name": "5V 독립 과전압 보호",
      "subtitle": "차단형 OVP / 역전류 차단",
      "kind": "protector",
      "group": "compute",
      "position": [
        0.22,
        0.35,
        -0.24
      ],
      "ports": {
        "IN+": "5V_RAW",
        "OUT+": "5V_PROT",
        "0V": "0V"
      },
      "notes": "배터리 완충 전압과 예상 과도전압을 견디고 컨버터 고장 입력을 차단하는 실부품 검증. 24V라는 공칭값만으로 고장 내압을 선정하지 않음. 트립 임계 최대값 + 과도 오버슈트가 연결 부하의 허용값 아래여야 한다. TVS/퓨즈만으로 5V 부품 보호를 승인하지 않는다. 일반 저전압 로드스위치 임의 대체 금지.",
      "status": "hold",
      "source": [
        "R2"
      ],
      "delta": "추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "F7",
      "name": "SBC 5V 분기 퓨즈",
      "subtitle": "커넥터 전류·전압강하 검증",
      "kind": "fuse",
      "group": "compute",
      "position": [
        0.14,
        0.351,
        -0.205
      ],
      "ports": {
        "IN": "5V_PROT",
        "OUT": "OPI5"
      },
      "notes": "출력 배선·SBC/허브 기동 부하를 기준으로 정격 산출. 5V 주전류를 듀퐁선으로 공급하지 않는다.",
      "status": "hold",
      "source": [
        "R2"
      ],
      "delta": "유지",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "F8",
      "name": "허브 5V 분기 퓨즈",
      "subtitle": "커넥터 전류·전압강하 검증",
      "kind": "fuse",
      "group": "compute",
      "position": [
        0.24,
        0.351,
        -0.205
      ],
      "ports": {
        "IN": "5V_PROT",
        "OUT": "HUB5"
      },
      "notes": "출력 배선·SBC/허브 기동 부하를 기준으로 정격 산출. 5V 주전류를 듀퐁선으로 공급하지 않는다.",
      "status": "hold",
      "source": [
        "R2"
      ],
      "delta": "유지",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "OP1",
      "name": "Orange Pi 4 Pro",
      "subtitle": "단일 Type-C 5V 입력",
      "kind": "board",
      "group": "compute",
      "position": [
        0.17,
        0.35,
        -0.11
      ],
      "ports": {
        "PWR5": "OPI5",
        "PWR0": "0V",
        "HOST": "USB_UP"
      },
      "notes": "정확한 4 Pro 전원 포트·요구전류는 실매뉴얼/제품으로 재확인. 4B/5 시리즈 매뉴얼을 대체 근거로 사용하지 않음. 규격을 만족하는 Type-C 전원 케이블/소스 CC 구성 사용; 9/12V PD 트리거 금지.",
      "status": "hold",
      "source": [
        "R3"
      ],
      "delta": "유지",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "H1",
      "name": "외부전원 USB 허브",
      "subtitle": "4포트 / upstream 역급전 금지",
      "kind": "hub",
      "group": "compute",
      "position": [
        0.17,
        0.348,
        0.015
      ],
      "ports": {
        "DC5": "HUB5",
        "DC0": "0V",
        "UP": "USB_UP",
        "P1": "USB_ESP",
        "P2": "USB_LIDAR",
        "P3": "USB_UWL",
        "P4": "USB_UWR"
      },
      "notes": "각 포트 전류 제한/기동 능력, upstream VBUS 역급전 차단 지원 제품. VBUS 선을 임의 절단하면 장치 감지가 안 될 수 있으므로 규격에 맞는 완성 허브 사용. D+/D-/GND/VBUS는 완성 케이블 내부 도체로 표시.",
      "status": "hold",
      "source": [
        "R2",
        "R3"
      ],
      "delta": "유지",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "U1",
      "name": "ESP32-DevKitC V4",
      "subtitle": "WROOM-32E / 38핀",
      "kind": "board",
      "group": "compute",
      "position": [
        0.065,
        0.35,
        0.015
      ],
      "ports": {
        "USB": "USB_ESP",
        "J2.1_3V3": "3V3",
        "J2.14_GND": "0V",
        "J3.11_IO17": "L_A_TX",
        "J3.12_IO16": "L_A_RX",
        "J2.9_IO25": "R_A_TX",
        "J2.10_IO26": "R_A_RX",
        "J3.9_IO18": "IMU_SCK",
        "J3.2_IO23": "IMU_MOSI",
        "J3.8_IO19": "IMU_MISO",
        "J2.11_IO27": "IMU_CS",
        "J2.5_IO34": "IMU_INT",
        "J2.7_IO32": "IMU_RST",
        "J3.6_IO21": "SDA",
        "J3.3_IO22": "SCL",
        "J2.8_IO33": "MUX_RST",
        "J2.15_IO13": "PWM_L_3V3",
        "J2.12_IO14": "PWM_R_3V3"
      },
      "notes": "USB만 급전. 5V/3V3 헤더에 다른 전원 입력 금지. 3V3는 여기서 센서/인터페이스로 나가는 출력. 센서 총전류와 보드 LDO 여유 확인. GPIO34는 입력 전용. UART0(GPIO1/3)는 USB 디버그와 공유하므로 모터 제어에 배정하지 않음. D3: IO13(좌)/IO14(우)를 서보 PWM 입력에 사용. 5V 서보 신호나 12V 전원을 GPIO에 직접 연결하지 않는다. 펌웨어 미구현; 서보 중립·방향·동기화 검증 별도.",
      "status": "review",
      "source": [
        "S2",
        "R2"
      ],
      "delta": "유지",
      "terminalBasis": "Espressif V4 J2/J3 표 기준 (클론/다른 보드 제외)"
    },
    {
      "id": "ISOL",
      "name": "UART 전원분리 L",
      "subtitle": "ISO7721 계열 완성 모듈",
      "kind": "isolator",
      "group": "signal",
      "position": [
        -0.01,
        0.353,
        0.013
      ],
      "ports": {
        "VCCA": "3V3",
        "GNDA": "0V",
        "A_IN": "L_A_TX",
        "A_OUT": "L_A_RX",
        "VCCB": "DRV_L_3V3",
        "GNDB": "0V",
        "B_OUT": "UART_L_RX",
        "B_IN": "UART_L_TX"
      },
      "notes": "ESP32 측 VCCA=ESP 3.3V, 드라이버 측 VCCB=각 드라이버의 확인된 3.3V 패드. 상대 전원 OFF 때 I/O 역급전 없이 동작하는 완성 모듈·전원시퀀스 검증. 기능 포트명이며 IC 핀 번호가 아님. 공통 배터리 0V 때문에 전체 시스템 절연을 주장하지 않음.",
      "status": "hold",
      "source": [
        "S1",
        "S10"
      ],
      "delta": "추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "ISOR",
      "name": "UART 전원분리 R",
      "subtitle": "ISO7721 계열 완성 모듈",
      "kind": "isolator",
      "group": "signal",
      "position": [
        0.015,
        0.353,
        0.013
      ],
      "ports": {
        "VCCA": "3V3",
        "GNDA": "0V",
        "A_IN": "R_A_TX",
        "A_OUT": "R_A_RX",
        "VCCB": "DRV_R_3V3",
        "GNDB": "0V",
        "B_OUT": "UART_R_RX",
        "B_IN": "UART_R_TX"
      },
      "notes": "ESP32 측 VCCA=ESP 3.3V, 드라이버 측 VCCB=각 드라이버의 확인된 3.3V 패드. 상대 전원 OFF 때 I/O 역급전 없이 동작하는 완성 모듈·전원시퀀스 검증. 기능 포트명이며 IC 핀 번호가 아님. 공통 배터리 0V 때문에 전체 시스템 절연을 주장하지 않음.",
      "status": "hold",
      "source": [
        "S1",
        "S10"
      ],
      "delta": "추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "A1",
      "name": "C1 USB-UART 어댑터",
      "subtitle": "C1 정품 / 460800 baud",
      "kind": "adapter",
      "group": "sensor",
      "position": [
        0.23,
        0.353,
        0.077
      ],
      "ports": {
        "USB": "USB_LIDAR",
        "HARNESS": "C1_HARNESS"
      },
      "notes": "상단 센서 아래 보호 브래킷에 배치해 센서 UART 하네스는 짧게 유지. 원래 키트의 핀 순서와 커넥터를 사용. 임의 Dupont/USB-TTL 연결 금지. D3에서는 USB 어댑터를 전장 트레이에 두고 전용 하네스만 전면 우측 기둥을 따라 센서로 보낸다. 연장 길이·케이블 규격은 C1 제조사 조건을 확인한다.",
      "status": "review",
      "source": [
        "R3",
        "S7"
      ],
      "delta": "유지",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "LD1",
      "name": "전면 상단 RPLIDAR C1",
      "subtitle": "전면 레일 직결 / 스캔면 약 0.865m",
      "kind": "lidar",
      "group": "sensor",
      "position": [
        0,
        0.865,
        0.489
      ],
      "ports": {
        "HARNESS": "C1_HARNESS"
      },
      "notes": "높은 마스트 없이 전면 상단 레일의 짧은 브래킷에 장착. UWB 중심과 같은 약 0.865m 스캔 높이의 배치 제안. 손잡이·UWB·적재물이 같은 수평면을 가릴 수 있어 360° 유효 시야를 보장하지 않는다. 원본 CAD 치수 아님. 전용 하네스는 전면 레일과 우측 기둥을 따라 내려간다.",
      "status": "review",
      "source": [
        "R1",
        "S7"
      ],
      "delta": "마스트 제거·전면 상단 레일 이동",
      "direction": [
        0,
        0,
        1
      ],
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "UWL",
      "name": "BU04 베이스 L",
      "subtitle": "BU04-Kit / 거리 데이터 USB",
      "kind": "uwb",
      "group": "sensor",
      "position": [
        -0.313,
        0.865,
        0.446
      ],
      "ports": {
        "USB_RANGE": "USB_UWL"
      },
      "notes": "BU04-Kit p.9의 USB 거리 데이터 인터페이스(⑦) 사용. AT/다운로드 포트(⑧)가 아님. 펌웨어의 베이스2·태그1 동시 측정·ID·동기화·시간표시 검증. 금속 프레임/브래킷과 RF 안테나 이격은 실측.",
      "status": "review",
      "source": [
        "S6",
        "R3"
      ],
      "delta": "유지",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "UWR",
      "name": "BU04 베이스 R",
      "subtitle": "BU04-Kit / 거리 데이터 USB",
      "kind": "uwb",
      "group": "sensor",
      "position": [
        0.313,
        0.865,
        0.446
      ],
      "ports": {
        "USB_RANGE": "USB_UWR"
      },
      "notes": "BU04-Kit p.9의 USB 거리 데이터 인터페이스(⑦) 사용. AT/다운로드 포트(⑧)가 아님. 펌웨어의 베이스2·태그1 동시 측정·ID·동기화·시간표시 검증. 금속 프레임/브래킷과 RF 안테나 이격은 실측.",
      "status": "review",
      "source": [
        "S6",
        "R3"
      ],
      "delta": "유지",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "TAG",
      "name": "사용자 UWB 태그",
      "subtitle": "독립 배터리 / 무선 연결",
      "kind": "tag",
      "group": "sensor",
      "position": [
        0.76,
        0.93,
        0.64
      ],
      "ports": {},
      "notes": "베이스와 같은 유선 버스에 연결하지 않음. 호환 태그 역할·충전기·배터리·착용 방식 별도 확인. 모델에서 태그 위치는 관계 설명용.",
      "status": "hold",
      "source": [
        "R3"
      ],
      "delta": "유지",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "X3",
      "name": "센서 3.3V/0V 분배",
      "subtitle": "잠금형 단자 / 벤치 BB 별도",
      "kind": "terminal",
      "group": "signal",
      "position": [
        0.09,
        0.346,
        0.1
      ],
      "ports": {
        "3V3_IN": "3V3",
        "0V_IN": "0V",
        "3V3_IMU": "3V3",
        "0V_IMU": "0V",
        "3V3_MUX": "3V3",
        "0V_MUX": "0V",
        "3V3_T1": "3V3",
        "0V_T1": "0V",
        "3V3_T2": "3V3",
        "0V_T2": "0V",
        "3V3_ISO_L": "3V3",
        "0V_ISO_L": "0V",
        "3V3_ISO_R": "3V3",
        "0V_ISO_R": "0V",
        "3V3_PWM": "3V3",
        "0V_PWM": "0V"
      },
      "notes": "3.3V와 0V는 내부적으로도 분리된 두 단자군이다. 한 덩어리로 공통 연결되는 버스바에 혼재시키지 않는다. 이동체 실장은 납땜/잠금 커넥터 하네스. 400접점 브레드보드는 무동력 신호시험에만. 브레드보드에 배터리전압·SBC 전류·모터·코일·5V 레일을 넣지 않는 D2 구성.",
      "status": "review",
      "source": [
        "R2"
      ],
      "delta": "변경",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "IMU1",
      "name": "BNO085 자세 센서",
      "subtitle": "Adafruit #4754 / SPI",
      "kind": "imu",
      "group": "sensor",
      "position": [
        0.05,
        0.249,
        0.09
      ],
      "ports": {
        "VIN": "3V3",
        "GND": "0V",
        "SCL_SCK": "IMU_SCK",
        "DI_MOSI": "IMU_MOSI",
        "SDA_MISO": "IMU_MISO",
        "CS": "IMU_CS",
        "INT": "IMU_INT",
        "RST": "IMU_RST",
        "P0": "3V3",
        "P1": "3V3"
      },
      "notes": "VIN 3.3V. P0/P1 모두 HIGH로 SPI 선택. 3Vo와 BT는 NC. INT/RST 사용. 프레임 기준에 강체 고정; 브레드보드/움직이는 손잡이에 IMU를 고정하지 않는다.",
      "status": "review",
      "source": [
        "S3"
      ],
      "delta": "유지",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "MUX1",
      "name": "ToF I²C 멀티플렉서",
      "subtitle": "TCA9548A / 0x70",
      "kind": "mux",
      "group": "sensor",
      "position": [
        0.175,
        0.348,
        0.1
      ],
      "ports": {
        "VCC": "3V3",
        "GND": "0V",
        "SDA": "SDA",
        "SCL": "SCL",
        "SD0": "SDA_T1",
        "SC0": "SCL_T1",
        "SD1": "SDA_T2",
        "SC1": "SCL_T2",
        "A0": "0V",
        "A1": "0V",
        "A2": "0V",
        "RESET": "MUX_RST"
      },
      "notes": "TCA9548A 브레이크아웃의 실제 실크 확인. A0/A1/A2=0V → 0x70. CH0·CH1 중 한 채널만 열어 0x29 ToF에 접근. 사용하지 않는 채널 NC. RESET 10kΩ 3.3V 풀업 및 GPIO33 연결. 호스트 SDA/SCL 풀업은 온보드 유무/합성값 확인 후 실장. 이 MUX는 장거리 버퍼나 절연기가 아니다. 실하네스의 용량·상승시간·EMI를 계측하고 부적합하면 센서 근처 로컬 제어 또는 검증된 전송 확장 구조로 재설계.",
      "status": "review",
      "source": [
        "S5",
        "R3"
      ],
      "delta": "추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "TOF1",
      "name": "전방 ToF 1",
      "subtitle": "Pololu #3415 / 0x29",
      "kind": "tof",
      "group": "sensor",
      "position": [
        -0.205,
        0.311,
        0.551
      ],
      "ports": {
        "VIN": "3V3",
        "GND": "0V",
        "SDA": "SDA_T1",
        "SCL": "SCL_T1"
      },
      "notes": "전방(+Z)을 향하는 VL53L1X. CH0만 선택한 뒤 0x29 접근. VIN 3.3V / GND / SDA / SCL을 유지하며 전기적 핀 역할은 바뀌지 않는다. VDD·XSHUT·GPIO1은 NC. 광학창은 범퍼 앞쪽에 노출하되 충돌 보호 브래킷은 시야를 가리지 않는다. 이제 바닥 낙차 감지용이 아니므로 계단·절벽 감지 기능은 없다. 검출범위와 실외 성능은 실측 필요.",
      "status": "review",
      "source": [
        "S4",
        "R3"
      ],
      "delta": "하향 → 전방 회전·브래킷 변경",
      "direction": [
        0,
        0,
        1
      ],
      "terminalBasis": "Pololu #3415 실크 이름. 커넥터 방향 실물 대조"
    },
    {
      "id": "TOF2",
      "name": "전방 ToF 2",
      "subtitle": "Pololu #3415 / 0x29",
      "kind": "tof",
      "group": "sensor",
      "position": [
        0.205,
        0.311,
        0.551
      ],
      "ports": {
        "VIN": "3V3",
        "GND": "0V",
        "SDA": "SDA_T2",
        "SCL": "SCL_T2"
      },
      "notes": "전방(+Z)을 향하는 VL53L1X. CH1만 선택한 뒤 0x29 접근. VIN 3.3V / GND / SDA / SCL을 유지하며 전기적 핀 역할은 바뀌지 않는다. VDD·XSHUT·GPIO1은 NC. 광학창은 범퍼 앞쪽에 노출하되 충돌 보호 브래킷은 시야를 가리지 않는다. 이제 바닥 낙차 감지용이 아니므로 계단·절벽 감지 기능은 없다. 검출범위와 실외 성능은 실측 필요.",
      "status": "review",
      "source": [
        "S4",
        "R3"
      ],
      "delta": "하향 → 전방 회전·브래킷 변경",
      "direction": [
        0,
        0,
        1
      ],
      "terminalBasis": "Pololu #3415 실크 이름. 커넥터 방향 실물 대조"
    },
    {
      "id": "RP_SDA",
      "name": "풀업 SDA",
      "subtitle": "4.7kΩ 검토",
      "kind": "resistor",
      "group": "signal",
      "position": [
        0.15,
        0.35,
        0.127
      ],
      "ports": {
        "1": "3V3",
        "2": "SDA"
      },
      "notes": "온보드 저항과 병렬 합성값을 확인. 중복 실장 방지. GPIO34 내부 풀업에 의존하지 않는다. 파형 상승시간과 LOW 싱크전류 검증.",
      "status": "review",
      "source": [
        "S3",
        "S5"
      ],
      "delta": "추가/온보드 확인",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "RP_SCL",
      "name": "풀업 SCL",
      "subtitle": "4.7kΩ 검토",
      "kind": "resistor",
      "group": "signal",
      "position": [
        0.17,
        0.35,
        0.127
      ],
      "ports": {
        "1": "3V3",
        "2": "SCL"
      },
      "notes": "온보드 저항과 병렬 합성값을 확인. 중복 실장 방지. GPIO34 내부 풀업에 의존하지 않는다. 파형 상승시간과 LOW 싱크전류 검증.",
      "status": "review",
      "source": [
        "S3",
        "S5"
      ],
      "delta": "추가/온보드 확인",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "RP_RST",
      "name": "풀업 MUX_RST",
      "subtitle": "10kΩ",
      "kind": "resistor",
      "group": "signal",
      "position": [
        0.19,
        0.35,
        0.127
      ],
      "ports": {
        "1": "3V3",
        "2": "MUX_RST"
      },
      "notes": "온보드 저항과 병렬 합성값을 확인. 중복 실장 방지. GPIO34 내부 풀업에 의존하지 않는다. 파형 상승시간과 LOW 싱크전류 검증.",
      "status": "review",
      "source": [
        "S3",
        "S5"
      ],
      "delta": "추가/온보드 확인",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "RP_INT",
      "name": "풀업 IMU_INT",
      "subtitle": "10kΩ 검토",
      "kind": "resistor",
      "group": "signal",
      "position": [
        0.05,
        0.256,
        0.1
      ],
      "ports": {
        "1": "3V3",
        "2": "IMU_INT"
      },
      "notes": "온보드 저항과 병렬 합성값을 확인. 중복 실장 방지. GPIO34 내부 풀업에 의존하지 않는다. 파형 상승시간과 LOW 싱크전류 검증.",
      "status": "review",
      "source": [
        "S3",
        "S5"
      ],
      "delta": "추가/온보드 확인",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "CH1",
      "name": "충전 전용 커넥터",
      "subtitle": "배터리/BMS 전용 충전 포트",
      "kind": "charge",
      "group": "power",
      "position": [
        0.27,
        0.188,
        -0.1
      ],
      "ports": {
        "+": "CHG_FUSED",
        "-": "CHG-"
      },
      "notes": "BMS 지정 포트 및 화학계에 맞는 충전기만. 이 구성은 S0 OFF 및 별도 충전 절차가 필요한 정비 모드. 주행·충전 동시 금지, 충전 중 배터리의 차체 구동 플러그를 물리적으로 분리. 충전 커넥터는 S0 OFF에서도 전압이 존재할 수 있다.",
      "status": "hold",
      "source": [
        "R3"
      ],
      "delta": "명시",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "FCH",
      "name": "충전 분기 퓨즈",
      "subtitle": "배터리 충전 포트 인접",
      "kind": "fuse",
      "group": "power",
      "position": [
        0.18,
        0.21,
        -0.1
      ],
      "ports": {
        "IN": "CHG+",
        "OUT": "CHG_FUSED"
      },
      "notes": "충전 전류·포트 역극성 보호·배터리 측 단락전류에 따른 DC 정격. 실모델 승인 전 결선 금지.",
      "status": "hold",
      "source": [
        "R3"
      ],
      "delta": "추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "F11",
      "name": "조향 입력 퓨즈",
      "subtitle": "K2 하류 / DC3 입력 보호",
      "kind": "fuse",
      "group": "steering",
      "position": [
        -0.255,
        0.35,
        0.185
      ],
      "ports": {
        "IN": "DRIVE24",
        "OUT": "STEER_IN"
      },
      "notes": "K1/K2를 우회하지 않는다. DC 정격전압·차단용량·DC3 기동전류·선로 허용전류에 맞춰 선정. A값은 미정.",
      "status": "hold",
      "source": [
        "R4"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "DC3",
      "name": "서보 전용 DC-DC",
      "subtitle": "배터리 버스 → 12V / 20A 목표",
      "kind": "converter",
      "group": "steering",
      "position": [
        -0.185,
        0.352,
        0.213
      ],
      "ports": {
        "IN+": "STEER_IN",
        "IN-": "0V",
        "OUT+": "12V_RAW",
        "OUT-": "0V"
      },
      "notes": "제어 5V 및 안전 24V 전원과 별도. 12V/20A는 설계 목표로 확정 제품 정격 아님. 배터리 최고전압·과도전압 내압, 두 서보 동시 스톨/기동, 열저감과 실제 커넥터 전류를 시험해야 한다. 입력 차단 뒤 출력이 떨어지는 시간도 측정.",
      "status": "hold",
      "source": [
        "R4"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "OV12",
      "name": "서보 전원 보호",
      "subtitle": "OVP / 역전류 차단 / 전류 제한",
      "kind": "protector",
      "group": "steering",
      "position": [
        -0.098,
        0.352,
        0.198
      ],
      "ports": {
        "IN+": "12V_RAW",
        "OUT+": "12V_STEER",
        "0V": "0V"
      },
      "notes": "실모델 미선정인 보호 조립체. 컨버터 고장 시 입력 버스전압을 견디는 독립 OVP와 재시도/래치 동작을 정해야 한다. 최대 트립전압+오버슈트가 실제 서보 상한보다 낮아야 한다. 퓨즈만으로 서보 과전압·열손상을 막을 수 없다.",
      "status": "hold",
      "source": [
        "R4"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "X12",
      "name": "서보 전원·귀환 단자대",
      "subtitle": "12V / 0V 별도 절연 버스",
      "kind": "terminal",
      "group": "steering",
      "position": [
        -0.012,
        0.352,
        0.195
      ],
      "ports": {
        "IN": "12V_STEER",
        "L": "12V_STEER",
        "R": "12V_STEER",
        "LOGIC": "12V_STEER",
        "ABS+": "12V_STEER",
        "RETURN": "0V",
        "L0": "0V",
        "R0": "0V",
        "LOGIC0": "0V",
        "SIG0": "0V",
        "ABS-": "0V"
      },
      "notes": "12V 군과 0V 군은 서로 절연된 두 단자군. 서보 L/R의 고전류 귀환은 별도 굵은 선으로 이곳에 모은 뒤 DC3 OUT-로 복귀. ESP32/신호선/USB로 서보 전류를 반환하지 않는다.",
      "status": "hold",
      "source": [
        "R4"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "CL12",
      "name": "서보 레일 에너지 흡수",
      "subtitle": "12V 로컬 클램프·방전 조립체",
      "kind": "clamp",
      "group": "steering",
      "position": [
        -0.02,
        0.352,
        0.27
      ],
      "ports": {
        "+": "12V_STEER",
        "-": "0V"
      },
      "notes": "서보의 역구동·급감속 및 입력 차단 때 발생하는 레일 상승을 평가한 후 임계값/에너지/열/방전을 선정. DC3와 OV12는 회생 에너지를 자동 흡수한다고 가정하지 않는다. 단순 TVS만으로 지속 에너지 흡수를 승인하지 않는다.",
      "status": "hold",
      "source": [
        "R4"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "F5",
      "name": "L 서보 분기 퓨즈",
      "subtitle": "전력 하네스 개별 보호",
      "kind": "fuse",
      "group": "steering",
      "position": [
        -0.12,
        0.35,
        0.291
      ],
      "ports": {
        "IN": "12V_STEER",
        "OUT": "SVL_12"
      },
      "notes": "실제 스톨전류·전자식 전류제한·선로/단자 허용전류·시간전류 곡선에 따라 확정. 기존 B1의 10A 숫자를 통전 승인값으로 가져오지 않는다.",
      "status": "hold",
      "source": [
        "R4"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "SVL",
      "name": "L 전륜 조향 서보",
      "subtitle": "RDS51150-12V 계열 / 모델 확인",
      "kind": "servo",
      "group": "steering",
      "position": [
        -0.319,
        0.198,
        0.288
      ],
      "ports": {
        "V+": "SVL_12",
        "GND": "0V",
        "PWM": "SVL_PWM"
      },
      "notes": "차체 고정 서보 혼 → 조정식 링크 → 킹핀 조향암. 바퀴 하중은 별도 베어링/포크가 지지하고 서보 출력축에 직접 싣지 않는다. 정확한 RDS51150 파생형·정격전압·신호 5V 허용·PWM 주기/펄스폭·스톨전류·선 순서는 실물 자료로 확인. 150kg 표기를 적재하중 150kg로 해석하지 않는다. 신호 소실 때 자유회전/유지/최종각 동작을 시험해야 한다.",
      "status": "hold",
      "source": [
        "R2",
        "R3",
        "S13"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "JSL",
      "name": "L 서보 잠금 커넥터",
      "subtitle": "전원 / 귀환 / PWM",
      "kind": "connector",
      "group": "steering",
      "position": [
        -0.245,
        0.244,
        0.25
      ],
      "ports": {
        "PWR": "SVL_12",
        "GND": "0V",
        "SIG": "SVL_PWM"
      },
      "notes": "논리 포트명이며 구매 커넥터의 핀 1/2/3을 확정한 것이 아니다. 공급사 선색을 믿지 말고 실크/핀맵/도통으로 대조. 정격·압착·장력 완화·조향 전각의 간섭을 확인한다.",
      "status": "hold",
      "source": [
        "R4"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "F6",
      "name": "R 서보 분기 퓨즈",
      "subtitle": "전력 하네스 개별 보호",
      "kind": "fuse",
      "group": "steering",
      "position": [
        0.11,
        0.35,
        0.291
      ],
      "ports": {
        "IN": "12V_STEER",
        "OUT": "SVR_12"
      },
      "notes": "실제 스톨전류·전자식 전류제한·선로/단자 허용전류·시간전류 곡선에 따라 확정. 기존 B1의 10A 숫자를 통전 승인값으로 가져오지 않는다.",
      "status": "hold",
      "source": [
        "R4"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "SVR",
      "name": "R 전륜 조향 서보",
      "subtitle": "RDS51150-12V 계열 / 모델 확인",
      "kind": "servo",
      "group": "steering",
      "position": [
        0.319,
        0.198,
        0.288
      ],
      "ports": {
        "V+": "SVR_12",
        "GND": "0V",
        "PWM": "SVR_PWM"
      },
      "notes": "차체 고정 서보 혼 → 조정식 링크 → 킹핀 조향암. 바퀴 하중은 별도 베어링/포크가 지지하고 서보 출력축에 직접 싣지 않는다. 정확한 RDS51150 파생형·정격전압·신호 5V 허용·PWM 주기/펄스폭·스톨전류·선 순서는 실물 자료로 확인. 150kg 표기를 적재하중 150kg로 해석하지 않는다. 신호 소실 때 자유회전/유지/최종각 동작을 시험해야 한다.",
      "status": "hold",
      "source": [
        "R2",
        "R3",
        "S13"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "JSR",
      "name": "R 서보 잠금 커넥터",
      "subtitle": "전원 / 귀환 / PWM",
      "kind": "connector",
      "group": "steering",
      "position": [
        0.245,
        0.244,
        0.25
      ],
      "ports": {
        "PWR": "SVR_12",
        "GND": "0V",
        "SIG": "SVR_PWM"
      },
      "notes": "논리 포트명이며 구매 커넥터의 핀 1/2/3을 확정한 것이 아니다. 공급사 선색을 믿지 말고 실크/핀맵/도통으로 대조. 정격·압착·장력 완화·조향 전각의 간섭을 확인한다.",
      "status": "hold",
      "source": [
        "R4"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "F10",
      "name": "PWM 전원 분기 퓨즈",
      "subtitle": "12V → DC4",
      "kind": "fuse",
      "group": "steering",
      "position": [
        0.055,
        0.353,
        0.235
      ],
      "ports": {
        "IN": "12V_STEER",
        "OUT": "PWM_SUP_IN"
      },
      "notes": "12V 서보 버스의 저전류 전원 분기. 신호 회로 단락이 서보 메인 하네스를 가열하지 않게 입력 보호. 정격은 실모델 기준.",
      "status": "hold",
      "source": [
        "R4"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "DC4",
      "name": "서보측 신호 전원",
      "subtitle": "12V → 5V / 독립 OVP 확인",
      "kind": "converter",
      "group": "steering",
      "position": [
        0.113,
        0.354,
        0.211
      ],
      "ports": {
        "IN+": "PWM_SUP_IN",
        "IN-": "0V",
        "OUT+": "5V_SERVO_IO",
        "OUT-": "0V"
      },
      "notes": "ISO7720F 출력측 전용 5V. SBC 5V 및 ESP32 3V3와 병렬 금지. 5.5V는 ISO 공급 권장범위 상한이며 설계 목표전압이 아니다. 제품 내부 OVP·기동/차단 파형 확인.",
      "status": "hold",
      "source": [
        "S11",
        "S12"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "U2",
      "name": "서보 PWM 인터페이스",
      "subtitle": "ISO7720F / 2채널 단방향",
      "kind": "isolator",
      "group": "steering",
      "position": [
        0.207,
        0.353,
        0.211
      ],
      "ports": {
        "1_VCC1": "3V3",
        "2_INA": "PWM_L_3V3",
        "3_INB": "PWM_R_3V3",
        "4_GND1": "0V",
        "5_GND2": "0V",
        "6_OUTB": "PWM_R_5V",
        "7_OUTA": "PWM_L_5V",
        "8_VCC2": "5V_SERVO_IO"
      },
      "notes": "SOIC-8 D/DWV의 실칩 핀 번호 기준; 16핀 DW 또는 모듈 헤더 번호와 혼동 금지. VCC1=ESP 3.3V / VCC2=DC4 5V. 반드시 F(default LOW) 변형 확인. 입력측 전원 소실은 LOW로 떨어지지만 MCU가 멈춘 채 PWM을 계속 내는 고장까지 검출하지 않는다. 시스템 공통 0V이므로 전체 갈바닉 절연/안전정지 인증을 주장하지 않는다.",
      "status": "hold",
      "source": [
        "S11",
        "S12"
      ],
      "delta": "D3 추가",
      "terminalBasis": "TI ISO7720F SOIC-8 D/DWV 실칩. 모듈 헤더는 별도 대조"
    },
    {
      "id": "R21",
      "name": "PWM R21",
      "subtitle": "10kΩ / L 입력 풀다운",
      "kind": "resistor",
      "group": "steering",
      "position": [
        0.171,
        0.356,
        0.167
      ],
      "ports": {
        "1": "PWM_L_3V3",
        "2": "0V"
      },
      "notes": "초기 회로 검토값. 1% 저항을 검토하며 실제 PWM 파형/케이블 용량/서보 입력 저항과 함께 확인. R25/R26은 서보 커넥터 가까이에 배치. 저항만으로 역급전이나 고장 안전을 보증하지 않는다.",
      "status": "review",
      "source": [
        "S11",
        "S12"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "R22",
      "name": "PWM R22",
      "subtitle": "10kΩ / R 입력 풀다운",
      "kind": "resistor",
      "group": "steering",
      "position": [
        0.184,
        0.356,
        0.167
      ],
      "ports": {
        "1": "PWM_R_3V3",
        "2": "0V"
      },
      "notes": "초기 회로 검토값. 1% 저항을 검토하며 실제 PWM 파형/케이블 용량/서보 입력 저항과 함께 확인. R25/R26은 서보 커넥터 가까이에 배치. 저항만으로 역급전이나 고장 안전을 보증하지 않는다.",
      "status": "review",
      "source": [
        "S11",
        "S12"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "R23",
      "name": "PWM R23",
      "subtitle": "220Ω / L 출력 직렬",
      "kind": "resistor",
      "group": "steering",
      "position": [
        0.208,
        0.355,
        0.258
      ],
      "ports": {
        "1": "PWM_L_5V",
        "2": "SVL_PWM"
      },
      "notes": "초기 회로 검토값. 1% 저항을 검토하며 실제 PWM 파형/케이블 용량/서보 입력 저항과 함께 확인. R25/R26은 서보 커넥터 가까이에 배치. 저항만으로 역급전이나 고장 안전을 보증하지 않는다.",
      "status": "review",
      "source": [
        "S11",
        "S12"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "R24",
      "name": "PWM R24",
      "subtitle": "220Ω / R 출력 직렬",
      "kind": "resistor",
      "group": "steering",
      "position": [
        0.231,
        0.355,
        0.258
      ],
      "ports": {
        "1": "PWM_R_5V",
        "2": "SVR_PWM"
      },
      "notes": "초기 회로 검토값. 1% 저항을 검토하며 실제 PWM 파형/케이블 용량/서보 입력 저항과 함께 확인. R25/R26은 서보 커넥터 가까이에 배치. 저항만으로 역급전이나 고장 안전을 보증하지 않는다.",
      "status": "review",
      "source": [
        "S11",
        "S12"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "R25",
      "name": "PWM R25",
      "subtitle": "10kΩ / L 수신측 풀다운",
      "kind": "resistor",
      "group": "steering",
      "position": [
        -0.231,
        0.252,
        0.263
      ],
      "ports": {
        "1": "SVL_PWM",
        "2": "0V"
      },
      "notes": "초기 회로 검토값. 1% 저항을 검토하며 실제 PWM 파형/케이블 용량/서보 입력 저항과 함께 확인. R25/R26은 서보 커넥터 가까이에 배치. 저항만으로 역급전이나 고장 안전을 보증하지 않는다.",
      "status": "review",
      "source": [
        "S11",
        "S12"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "R26",
      "name": "PWM R26",
      "subtitle": "10kΩ / R 수신측 풀다운",
      "kind": "resistor",
      "group": "steering",
      "position": [
        0.231,
        0.252,
        0.263
      ],
      "ports": {
        "1": "SVR_PWM",
        "2": "0V"
      },
      "notes": "초기 회로 검토값. 1% 저항을 검토하며 실제 PWM 파형/케이블 용량/서보 입력 저항과 함께 확인. R25/R26은 서보 커넥터 가까이에 배치. 저항만으로 역급전이나 고장 안전을 보증하지 않는다.",
      "status": "review",
      "source": [
        "S11",
        "S12"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "C21",
      "name": "인터페이스 디커플링 C21",
      "subtitle": "0.1µF X7R / 공급핀 바로 옆",
      "kind": "capacitor",
      "group": "steering",
      "position": [
        0.198,
        0.356,
        0.185
      ],
      "ports": {
        "+": "3V3",
        "-": "0V"
      },
      "notes": "VCC1-GND1, VCC2-GND2에 각각 0.1µF. 비극성 세라믹이며 +/−는 전원측/접지측 구분용 기능명. 모듈 내장품이면 중복 설치를 피한다.",
      "status": "review",
      "source": [
        "S12"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    },
    {
      "id": "C22",
      "name": "인터페이스 디커플링 C22",
      "subtitle": "0.1µF X7R / 공급핀 바로 옆",
      "kind": "capacitor",
      "group": "steering",
      "position": [
        0.232,
        0.356,
        0.225
      ],
      "ports": {
        "+": "5V_SERVO_IO",
        "-": "0V"
      },
      "notes": "VCC1-GND1, VCC2-GND2에 각각 0.1µF. 비극성 세라믹이며 +/−는 전원측/접지측 구분용 기능명. 모듈 내장품이면 중복 설치를 피한다.",
      "status": "review",
      "source": [
        "S12"
      ],
      "delta": "D3 추가",
      "terminalBasis": "기능 포트. 실물 모델·핀순서 확인"
    }
  ],
  "connections": [
    {
      "id": "W001",
      "from": "BT1:+",
      "to": "F0:IN",
      "net": "BAT+",
      "kind": "power",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W002",
      "from": "F0:OUT",
      "to": "S0:IN",
      "net": "BAT_FUSED",
      "kind": "power",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W003",
      "from": "S0:OUT",
      "to": "X24:IN",
      "net": "BUS24",
      "kind": "power",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W004",
      "from": "BT1:-",
      "to": "X0:BAT",
      "net": "0V",
      "kind": "return",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W005",
      "from": "X24:DRIVE",
      "to": "K1:L1",
      "net": "BUS24",
      "kind": "power",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W006",
      "from": "K1:T1",
      "to": "K2:L1",
      "net": "K_MID",
      "kind": "power",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W007",
      "from": "K2:T1",
      "to": "F1:IN",
      "net": "DRIVE24",
      "kind": "power",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "CL/RB는 드라이버 동일 로컬 링크에 병렬",
      "status": "hold"
    },
    {
      "id": "W008",
      "from": "F1:OUT",
      "to": "PPL:IN+",
      "net": "FUSED_L",
      "kind": "power",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "CL/RB는 드라이버 동일 로컬 링크에 병렬",
      "status": "hold"
    },
    {
      "id": "W009",
      "from": "PPL:OUT+",
      "to": "MDL:VIN",
      "net": "LINK_L",
      "kind": "power",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "CL/RB는 드라이버 동일 로컬 링크에 병렬",
      "status": "hold"
    },
    {
      "id": "W010",
      "from": "MDL:VIN",
      "to": "CLL:+",
      "net": "LINK_L",
      "kind": "power",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "CL/RB는 드라이버 동일 로컬 링크에 병렬",
      "status": "hold"
    },
    {
      "id": "W011",
      "from": "MDL:VIN",
      "to": "RBL:+",
      "net": "LINK_L",
      "kind": "power",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "CL/RB는 드라이버 동일 로컬 링크에 병렬",
      "status": "hold"
    },
    {
      "id": "W012",
      "from": "X0:ML",
      "to": "MDL:GND",
      "net": "0V",
      "kind": "return",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W013",
      "from": "MDL:GND",
      "to": "CLL:-",
      "net": "0V",
      "kind": "return",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W014",
      "from": "MDL:GND",
      "to": "RBL:-",
      "net": "0V",
      "kind": "return",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W015",
      "from": "MDL:GND",
      "to": "PPL:0V",
      "net": "0V",
      "kind": "return",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W016",
      "from": "MDL:OUTA",
      "to": "ML:A",
      "net": "ML_A",
      "kind": "motor",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "A/B 모두 부동 H브리지 출력. 0V 연결 금지.",
      "status": "hold"
    },
    {
      "id": "W017",
      "from": "MDL:OUTB",
      "to": "ML:B",
      "net": "ML_B",
      "kind": "motor",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "A/B 모두 부동 H브리지 출력. 0V 연결 금지.",
      "status": "hold"
    },
    {
      "id": "W018",
      "from": "ML:A",
      "to": "CML:1",
      "net": "ML_A",
      "kind": "motor",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "A/B 모두 부동 H브리지 출력. 0V 연결 금지.",
      "status": "hold"
    },
    {
      "id": "W019",
      "from": "ML:B",
      "to": "CML:2",
      "net": "ML_B",
      "kind": "motor",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "A/B 모두 부동 H브리지 출력. 0V 연결 금지.",
      "status": "hold"
    },
    {
      "id": "W020",
      "from": "K2:T1",
      "to": "F2:IN",
      "net": "DRIVE24",
      "kind": "power",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "CL/RB는 드라이버 동일 로컬 링크에 병렬",
      "status": "hold"
    },
    {
      "id": "W021",
      "from": "F2:OUT",
      "to": "PPR:IN+",
      "net": "FUSED_R",
      "kind": "power",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "CL/RB는 드라이버 동일 로컬 링크에 병렬",
      "status": "hold"
    },
    {
      "id": "W022",
      "from": "PPR:OUT+",
      "to": "MDR:VIN",
      "net": "LINK_R",
      "kind": "power",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "CL/RB는 드라이버 동일 로컬 링크에 병렬",
      "status": "hold"
    },
    {
      "id": "W023",
      "from": "MDR:VIN",
      "to": "CLR:+",
      "net": "LINK_R",
      "kind": "power",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "CL/RB는 드라이버 동일 로컬 링크에 병렬",
      "status": "hold"
    },
    {
      "id": "W024",
      "from": "MDR:VIN",
      "to": "RBR:+",
      "net": "LINK_R",
      "kind": "power",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "CL/RB는 드라이버 동일 로컬 링크에 병렬",
      "status": "hold"
    },
    {
      "id": "W025",
      "from": "X0:MR",
      "to": "MDR:GND",
      "net": "0V",
      "kind": "return",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W026",
      "from": "MDR:GND",
      "to": "CLR:-",
      "net": "0V",
      "kind": "return",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W027",
      "from": "MDR:GND",
      "to": "RBR:-",
      "net": "0V",
      "kind": "return",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W028",
      "from": "MDR:GND",
      "to": "PPR:0V",
      "net": "0V",
      "kind": "return",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W029",
      "from": "MDR:OUTA",
      "to": "MR:A",
      "net": "MR_A",
      "kind": "motor",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "A/B 모두 부동 H브리지 출력. 0V 연결 금지.",
      "status": "hold"
    },
    {
      "id": "W030",
      "from": "MDR:OUTB",
      "to": "MR:B",
      "net": "MR_B",
      "kind": "motor",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "A/B 모두 부동 H브리지 출력. 0V 연결 금지.",
      "status": "hold"
    },
    {
      "id": "W031",
      "from": "MR:A",
      "to": "CMR:1",
      "net": "MR_A",
      "kind": "motor",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "A/B 모두 부동 H브리지 출력. 0V 연결 금지.",
      "status": "hold"
    },
    {
      "id": "W032",
      "from": "MR:B",
      "to": "CMR:2",
      "net": "MR_B",
      "kind": "motor",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "A/B 모두 부동 H브리지 출력. 0V 연결 금지.",
      "status": "hold"
    },
    {
      "id": "W033",
      "from": "X24:AUX24",
      "to": "F3:IN",
      "net": "BUS24",
      "kind": "power",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W034",
      "from": "F3:OUT",
      "to": "DC1:IN+",
      "net": "DC1_IN",
      "kind": "power",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W035",
      "from": "DC1:OUT+",
      "to": "F9:IN",
      "net": "SAFE24",
      "kind": "safety",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W036",
      "from": "F9:OUT",
      "to": "SR1:24V",
      "net": "SAFE24_F",
      "kind": "safety",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W037",
      "from": "F9:OUT",
      "to": "SR1:O1_FEED",
      "net": "SAFE24_F",
      "kind": "safety",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W038",
      "from": "F9:OUT",
      "to": "SR1:O2_FEED",
      "net": "SAFE24_F",
      "kind": "safety",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W039",
      "from": "X24:AUX5",
      "to": "F4:IN",
      "net": "BUS24",
      "kind": "power",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W040",
      "from": "F4:OUT",
      "to": "DC2:IN+",
      "net": "DC2_IN",
      "kind": "power",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W041",
      "from": "DC2:OUT+",
      "to": "OV5:IN+",
      "net": "5V_RAW",
      "kind": "logic",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W042",
      "from": "OV5:OUT+",
      "to": "F7:IN",
      "net": "5V_PROT",
      "kind": "logic",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W043",
      "from": "OV5:OUT+",
      "to": "F8:IN",
      "net": "5V_PROT",
      "kind": "logic",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W044",
      "from": "F7:OUT",
      "to": "OP1:PWR5",
      "net": "OPI5",
      "kind": "logic",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W045",
      "from": "F8:OUT",
      "to": "H1:DC5",
      "net": "HUB5",
      "kind": "logic",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W046",
      "from": "X0:DC1",
      "to": "DC1:IN-",
      "net": "0V",
      "kind": "return",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W047",
      "from": "DC1:IN-",
      "to": "DC1:OUT-",
      "net": "0V",
      "kind": "return",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W048",
      "from": "X0:DC2",
      "to": "DC2:IN-",
      "net": "0V",
      "kind": "return",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W049",
      "from": "DC2:IN-",
      "to": "DC2:OUT-",
      "net": "0V",
      "kind": "return",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W050",
      "from": "DC2:OUT-",
      "to": "OV5:0V",
      "net": "0V",
      "kind": "return",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W051",
      "from": "DC2:OUT-",
      "to": "OP1:PWR0",
      "net": "0V",
      "kind": "return",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W052",
      "from": "DC2:OUT-",
      "to": "H1:DC0",
      "net": "0V",
      "kind": "return",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W053",
      "from": "X0:SR",
      "to": "SR1:0V",
      "net": "0V",
      "kind": "return",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W054",
      "from": "SR1:TEST_A",
      "to": "S1:A_IN",
      "net": "ESTOP_A_OUT",
      "kind": "safety",
      "sheet": "safety",
      "gauge": "실측 후 선정",
      "note": "SR1/EDMは실단자 매핑 미확정",
      "status": "hold"
    },
    {
      "id": "W055",
      "from": "S1:A_OUT",
      "to": "SR1:RETURN_A",
      "net": "ESTOP_A_IN",
      "kind": "safety",
      "sheet": "safety",
      "gauge": "실측 후 선정",
      "note": "SR1/EDMは실단자 매핑 미확정",
      "status": "hold"
    },
    {
      "id": "W056",
      "from": "SR1:TEST_B",
      "to": "S1:B_IN",
      "net": "ESTOP_B_OUT",
      "kind": "safety",
      "sheet": "safety",
      "gauge": "실측 후 선정",
      "note": "SR1/EDMは실단자 매핑 미확정",
      "status": "hold"
    },
    {
      "id": "W057",
      "from": "S1:B_OUT",
      "to": "SR1:RETURN_B",
      "net": "ESTOP_B_IN",
      "kind": "safety",
      "sheet": "safety",
      "gauge": "실측 후 선정",
      "note": "SR1/EDMは실단자 매핑 미확정",
      "status": "hold"
    },
    {
      "id": "W058",
      "from": "SR1:RESET_OUT",
      "to": "S2:IN",
      "net": "RESET_OUT",
      "kind": "safety",
      "sheet": "safety",
      "gauge": "실측 후 선정",
      "note": "SR1/EDMは실단자 매핑 미확정",
      "status": "hold"
    },
    {
      "id": "W059",
      "from": "S2:OUT",
      "to": "SR1:RESET_IN",
      "net": "RESET_IN",
      "kind": "safety",
      "sheet": "safety",
      "gauge": "실측 후 선정",
      "note": "SR1/EDMは실단자 매핑 미확정",
      "status": "hold"
    },
    {
      "id": "W060",
      "from": "SR1:EDM_OUT",
      "to": "K1:EDM_IN",
      "net": "EDM_START",
      "kind": "safety",
      "sheet": "safety",
      "gauge": "실측 후 선정",
      "note": "SR1/EDMは실단자 매핑 미확정",
      "status": "hold"
    },
    {
      "id": "W061",
      "from": "K1:EDM_OUT",
      "to": "K2:EDM_IN",
      "net": "EDM_MID",
      "kind": "safety",
      "sheet": "safety",
      "gauge": "실측 후 선정",
      "note": "SR1/EDMは실단자 매핑 미확정",
      "status": "hold"
    },
    {
      "id": "W062",
      "from": "K2:EDM_OUT",
      "to": "SR1:EDM_IN",
      "net": "EDM_END",
      "kind": "safety",
      "sheet": "safety",
      "gauge": "실측 후 선정",
      "note": "SR1/EDMは실단자 매핑 미확정",
      "status": "hold"
    },
    {
      "id": "W063",
      "from": "SR1:O1",
      "to": "K1:A1",
      "net": "K1_COIL",
      "kind": "safety",
      "sheet": "safety",
      "gauge": "실측 후 선정",
      "note": "SR1/EDMは실단자 매핑 미확정",
      "status": "hold"
    },
    {
      "id": "W064",
      "from": "SR1:O2",
      "to": "K2:A1",
      "net": "K2_COIL",
      "kind": "safety",
      "sheet": "safety",
      "gauge": "실측 후 선정",
      "note": "SR1/EDMは실단자 매핑 미확정",
      "status": "hold"
    },
    {
      "id": "W065",
      "from": "K1:A1",
      "to": "Z1:+",
      "net": "K1_COIL",
      "kind": "safety",
      "sheet": "safety",
      "gauge": "실측 후 선정",
      "note": "SR1/EDMは실단자 매핑 미확정",
      "status": "hold"
    },
    {
      "id": "W066",
      "from": "K2:A1",
      "to": "Z2:+",
      "net": "K2_COIL",
      "kind": "safety",
      "sheet": "safety",
      "gauge": "실측 후 선정",
      "note": "SR1/EDMは실단자 매핑 미확정",
      "status": "hold"
    },
    {
      "id": "W067",
      "from": "X0:K1",
      "to": "K1:A2",
      "net": "0V",
      "kind": "return",
      "sheet": "safety",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W068",
      "from": "K1:A2",
      "to": "Z1:-",
      "net": "0V",
      "kind": "return",
      "sheet": "safety",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W069",
      "from": "X0:K2",
      "to": "K2:A2",
      "net": "0V",
      "kind": "return",
      "sheet": "safety",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W070",
      "from": "K2:A2",
      "to": "Z2:-",
      "net": "0V",
      "kind": "return",
      "sheet": "safety",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W071",
      "from": "OP1:HOST",
      "to": "H1:UP",
      "net": "USB_UP",
      "kind": "usb",
      "sheet": "signal",
      "gauge": "제조사 케이블",
      "note": "완성 케이블. USB: VBUS/D-/D+/GND; C1: 전용 5V/GND/TX/RX 하네스.",
      "status": "hold"
    },
    {
      "id": "W072",
      "from": "H1:P1",
      "to": "U1:USB",
      "net": "USB_ESP",
      "kind": "usb",
      "sheet": "signal",
      "gauge": "제조사 케이블",
      "note": "완성 케이블. USB: VBUS/D-/D+/GND; C1: 전용 5V/GND/TX/RX 하네스.",
      "status": "hold"
    },
    {
      "id": "W073",
      "from": "H1:P2",
      "to": "A1:USB",
      "net": "USB_LIDAR",
      "kind": "usb",
      "sheet": "signal",
      "gauge": "제조사 케이블",
      "note": "완성 케이블. USB: VBUS/D-/D+/GND; C1: 전용 5V/GND/TX/RX 하네스.",
      "status": "hold"
    },
    {
      "id": "W074",
      "from": "H1:P3",
      "to": "UWL:USB_RANGE",
      "net": "USB_UWL",
      "kind": "usb",
      "sheet": "signal",
      "gauge": "제조사 케이블",
      "note": "완성 케이블. USB: VBUS/D-/D+/GND; C1: 전용 5V/GND/TX/RX 하네스.",
      "status": "hold"
    },
    {
      "id": "W075",
      "from": "H1:P4",
      "to": "UWR:USB_RANGE",
      "net": "USB_UWR",
      "kind": "usb",
      "sheet": "signal",
      "gauge": "제조사 케이블",
      "note": "완성 케이블. USB: VBUS/D-/D+/GND; C1: 전용 5V/GND/TX/RX 하네스.",
      "status": "hold"
    },
    {
      "id": "W076",
      "from": "A1:HARNESS",
      "to": "LD1:HARNESS",
      "net": "C1_HARNESS",
      "kind": "usb",
      "sheet": "signal",
      "gauge": "제조사 케이블",
      "note": "완성 케이블. USB: VBUS/D-/D+/GND; C1: 전용 5V/GND/TX/RX 하네스.",
      "status": "review"
    },
    {
      "id": "W077",
      "from": "U1:J2.1_3V3",
      "to": "X3:3V3_IN",
      "net": "3V3",
      "kind": "logic",
      "sheet": "sensor",
      "gauge": "신호전류/거리 검토",
      "note": "",
      "status": "review"
    },
    {
      "id": "W078",
      "from": "U1:J2.14_GND",
      "to": "X3:0V_IN",
      "net": "0V",
      "kind": "return",
      "sheet": "sensor",
      "gauge": "신호전류/거리 검토",
      "note": "",
      "status": "review"
    },
    {
      "id": "W079",
      "from": "X3:3V3_IMU",
      "to": "IMU1:VIN",
      "net": "3V3",
      "kind": "logic",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "review"
    },
    {
      "id": "W080",
      "from": "X3:0V_IMU",
      "to": "IMU1:GND",
      "net": "0V",
      "kind": "return",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "review"
    },
    {
      "id": "W081",
      "from": "X3:3V3_MUX",
      "to": "MUX1:VCC",
      "net": "3V3",
      "kind": "logic",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "review"
    },
    {
      "id": "W082",
      "from": "X3:0V_MUX",
      "to": "MUX1:GND",
      "net": "0V",
      "kind": "return",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "review"
    },
    {
      "id": "W083",
      "from": "X3:3V3_T1",
      "to": "TOF1:VIN",
      "net": "3V3",
      "kind": "logic",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "review"
    },
    {
      "id": "W084",
      "from": "X3:0V_T1",
      "to": "TOF1:GND",
      "net": "0V",
      "kind": "return",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "review"
    },
    {
      "id": "W085",
      "from": "X3:3V3_T2",
      "to": "TOF2:VIN",
      "net": "3V3",
      "kind": "logic",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "review"
    },
    {
      "id": "W086",
      "from": "X3:0V_T2",
      "to": "TOF2:GND",
      "net": "0V",
      "kind": "return",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "review"
    },
    {
      "id": "W087",
      "from": "X3:3V3_ISO_L",
      "to": "ISOL:VCCA",
      "net": "3V3",
      "kind": "logic",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W088",
      "from": "X3:0V_ISO_L",
      "to": "ISOL:GNDA",
      "net": "0V",
      "kind": "return",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W089",
      "from": "X3:3V3_ISO_R",
      "to": "ISOR:VCCA",
      "net": "3V3",
      "kind": "logic",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W090",
      "from": "X3:0V_ISO_R",
      "to": "ISOR:GNDA",
      "net": "0V",
      "kind": "return",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W091",
      "from": "U1:J3.9_IO18",
      "to": "IMU1:SCL_SCK",
      "net": "IMU_SCK",
      "kind": "signal",
      "sheet": "sensor",
      "gauge": "짧은 3.3V 신호 하네스",
      "note": "",
      "status": "review"
    },
    {
      "id": "W092",
      "from": "U1:J3.2_IO23",
      "to": "IMU1:DI_MOSI",
      "net": "IMU_MOSI",
      "kind": "signal",
      "sheet": "sensor",
      "gauge": "짧은 3.3V 신호 하네스",
      "note": "",
      "status": "review"
    },
    {
      "id": "W093",
      "from": "U1:J3.8_IO19",
      "to": "IMU1:SDA_MISO",
      "net": "IMU_MISO",
      "kind": "signal",
      "sheet": "sensor",
      "gauge": "짧은 3.3V 신호 하네스",
      "note": "",
      "status": "review"
    },
    {
      "id": "W094",
      "from": "U1:J2.11_IO27",
      "to": "IMU1:CS",
      "net": "IMU_CS",
      "kind": "signal",
      "sheet": "sensor",
      "gauge": "짧은 3.3V 신호 하네스",
      "note": "",
      "status": "review"
    },
    {
      "id": "W095",
      "from": "U1:J2.5_IO34",
      "to": "IMU1:INT",
      "net": "IMU_INT",
      "kind": "signal",
      "sheet": "sensor",
      "gauge": "짧은 3.3V 신호 하네스",
      "note": "",
      "status": "review"
    },
    {
      "id": "W096",
      "from": "U1:J2.7_IO32",
      "to": "IMU1:RST",
      "net": "IMU_RST",
      "kind": "signal",
      "sheet": "sensor",
      "gauge": "짧은 3.3V 신호 하네스",
      "note": "",
      "status": "review"
    },
    {
      "id": "W097",
      "from": "U1:J3.6_IO21",
      "to": "MUX1:SDA",
      "net": "SDA",
      "kind": "signal",
      "sheet": "sensor",
      "gauge": "짧은 3.3V 신호 하네스",
      "note": "",
      "status": "review"
    },
    {
      "id": "W098",
      "from": "U1:J3.3_IO22",
      "to": "MUX1:SCL",
      "net": "SCL",
      "kind": "signal",
      "sheet": "sensor",
      "gauge": "짧은 3.3V 신호 하네스",
      "note": "",
      "status": "review"
    },
    {
      "id": "W099",
      "from": "U1:J2.8_IO33",
      "to": "MUX1:RESET",
      "net": "MUX_RST",
      "kind": "signal",
      "sheet": "sensor",
      "gauge": "짧은 3.3V 신호 하네스",
      "note": "",
      "status": "review"
    },
    {
      "id": "W100",
      "from": "IMU1:VIN",
      "to": "IMU1:P0",
      "net": "3V3",
      "kind": "logic",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "review"
    },
    {
      "id": "W101",
      "from": "IMU1:VIN",
      "to": "IMU1:P1",
      "net": "3V3",
      "kind": "logic",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "review"
    },
    {
      "id": "W102",
      "from": "MUX1:GND",
      "to": "MUX1:A0",
      "net": "0V",
      "kind": "return",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "review"
    },
    {
      "id": "W103",
      "from": "MUX1:GND",
      "to": "MUX1:A1",
      "net": "0V",
      "kind": "return",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "review"
    },
    {
      "id": "W104",
      "from": "MUX1:GND",
      "to": "MUX1:A2",
      "net": "0V",
      "kind": "return",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "review"
    },
    {
      "id": "W105",
      "from": "MUX1:SD0",
      "to": "TOF1:SDA",
      "net": "SDA_T1",
      "kind": "signal",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "같은 0x29 주소: 한 채널씩 활성화",
      "status": "review"
    },
    {
      "id": "W106",
      "from": "MUX1:SC0",
      "to": "TOF1:SCL",
      "net": "SCL_T1",
      "kind": "signal",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "같은 0x29 주소: 한 채널씩 활성화",
      "status": "review"
    },
    {
      "id": "W107",
      "from": "MUX1:SD1",
      "to": "TOF2:SDA",
      "net": "SDA_T2",
      "kind": "signal",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "같은 0x29 주소: 한 채널씩 활성화",
      "status": "review"
    },
    {
      "id": "W108",
      "from": "MUX1:SC1",
      "to": "TOF2:SCL",
      "net": "SCL_T2",
      "kind": "signal",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "같은 0x29 주소: 한 채널씩 활성화",
      "status": "review"
    },
    {
      "id": "W109",
      "from": "X3:3V3_IN",
      "to": "RP_SDA:1",
      "net": "3V3",
      "kind": "logic",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "온보드 중복 저항 확인",
      "status": "review"
    },
    {
      "id": "W110",
      "from": "RP_SDA:2",
      "to": "MUX1:SDA",
      "net": "SDA",
      "kind": "signal",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "온보드 중복 저항 확인",
      "status": "review"
    },
    {
      "id": "W111",
      "from": "X3:3V3_IN",
      "to": "RP_SCL:1",
      "net": "3V3",
      "kind": "logic",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "온보드 중복 저항 확인",
      "status": "review"
    },
    {
      "id": "W112",
      "from": "RP_SCL:2",
      "to": "MUX1:SCL",
      "net": "SCL",
      "kind": "signal",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "온보드 중복 저항 확인",
      "status": "review"
    },
    {
      "id": "W113",
      "from": "X3:3V3_IN",
      "to": "RP_RST:1",
      "net": "3V3",
      "kind": "logic",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "온보드 중복 저항 확인",
      "status": "review"
    },
    {
      "id": "W114",
      "from": "RP_RST:2",
      "to": "MUX1:RESET",
      "net": "MUX_RST",
      "kind": "signal",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "온보드 중복 저항 확인",
      "status": "review"
    },
    {
      "id": "W115",
      "from": "X3:3V3_IN",
      "to": "RP_INT:1",
      "net": "3V3",
      "kind": "logic",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "온보드 중복 저항 확인",
      "status": "review"
    },
    {
      "id": "W116",
      "from": "RP_INT:2",
      "to": "IMU1:INT",
      "net": "IMU_INT",
      "kind": "signal",
      "sheet": "sensor",
      "gauge": "실측 후 선정",
      "note": "온보드 중복 저항 확인",
      "status": "review"
    },
    {
      "id": "W117",
      "from": "U1:J3.11_IO17",
      "to": "ISOL:A_IN",
      "net": "L_A_TX",
      "kind": "signal",
      "sheet": "signal",
      "gauge": "실측 후 선정",
      "note": "전원분리 UART, 하드웨어 안전정지 대체 아님",
      "status": "hold"
    },
    {
      "id": "W118",
      "from": "ISOL:A_OUT",
      "to": "U1:J3.12_IO16",
      "net": "L_A_RX",
      "kind": "signal",
      "sheet": "signal",
      "gauge": "실측 후 선정",
      "note": "전원분리 UART, 하드웨어 안전정지 대체 아님",
      "status": "hold"
    },
    {
      "id": "W119",
      "from": "ISOL:B_OUT",
      "to": "MDL:RX",
      "net": "UART_L_RX",
      "kind": "signal",
      "sheet": "signal",
      "gauge": "실측 후 선정",
      "note": "전원분리 UART, 하드웨어 안전정지 대체 아님",
      "status": "hold"
    },
    {
      "id": "W120",
      "from": "MDL:TX",
      "to": "ISOL:B_IN",
      "net": "UART_L_TX",
      "kind": "signal",
      "sheet": "signal",
      "gauge": "실측 후 선정",
      "note": "전원분리 UART, 하드웨어 안전정지 대체 아님",
      "status": "hold"
    },
    {
      "id": "W121",
      "from": "MDL:3V3_BEC",
      "to": "ISOL:VCCB",
      "net": "DRV_L_3V3",
      "kind": "logic",
      "sheet": "signal",
      "gauge": "실측 후 선정",
      "note": "드라이버 측 전원. ESP 3V3와 병렬 접속 금지",
      "status": "hold"
    },
    {
      "id": "W122",
      "from": "MDL:GND",
      "to": "ISOL:GNDB",
      "net": "0V",
      "kind": "return",
      "sheet": "signal",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W123",
      "from": "U1:J2.9_IO25",
      "to": "ISOR:A_IN",
      "net": "R_A_TX",
      "kind": "signal",
      "sheet": "signal",
      "gauge": "실측 후 선정",
      "note": "전원분리 UART, 하드웨어 안전정지 대체 아님",
      "status": "hold"
    },
    {
      "id": "W124",
      "from": "ISOR:A_OUT",
      "to": "U1:J2.10_IO26",
      "net": "R_A_RX",
      "kind": "signal",
      "sheet": "signal",
      "gauge": "실측 후 선정",
      "note": "전원분리 UART, 하드웨어 안전정지 대체 아님",
      "status": "hold"
    },
    {
      "id": "W125",
      "from": "ISOR:B_OUT",
      "to": "MDR:RX",
      "net": "UART_R_RX",
      "kind": "signal",
      "sheet": "signal",
      "gauge": "실측 후 선정",
      "note": "전원분리 UART, 하드웨어 안전정지 대체 아님",
      "status": "hold"
    },
    {
      "id": "W126",
      "from": "MDR:TX",
      "to": "ISOR:B_IN",
      "net": "UART_R_TX",
      "kind": "signal",
      "sheet": "signal",
      "gauge": "실측 후 선정",
      "note": "전원분리 UART, 하드웨어 안전정지 대체 아님",
      "status": "hold"
    },
    {
      "id": "W127",
      "from": "MDR:3V3_BEC",
      "to": "ISOR:VCCB",
      "net": "DRV_R_3V3",
      "kind": "logic",
      "sheet": "signal",
      "gauge": "실측 후 선정",
      "note": "드라이버 측 전원. ESP 3V3와 병렬 접속 금지",
      "status": "hold"
    },
    {
      "id": "W128",
      "from": "MDR:GND",
      "to": "ISOR:GNDB",
      "net": "0V",
      "kind": "return",
      "sheet": "signal",
      "gauge": "실측 후 선정",
      "note": "",
      "status": "hold"
    },
    {
      "id": "W129",
      "from": "BT1:CHG+",
      "to": "FCH:IN",
      "net": "CHG+",
      "kind": "charge",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "실제 BMS 지정 충전 포트 확정 전 결선 금지",
      "status": "hold"
    },
    {
      "id": "W130",
      "from": "FCH:OUT",
      "to": "CH1:+",
      "net": "CHG_FUSED",
      "kind": "charge",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "실제 BMS 지정 충전 포트 확정 전 결선 금지",
      "status": "hold"
    },
    {
      "id": "W131",
      "from": "BT1:CHG-",
      "to": "CH1:-",
      "net": "CHG-",
      "kind": "charge",
      "sheet": "power",
      "gauge": "실측 후 선정",
      "note": "실제 BMS 지정 충전 포트 확정 전 결선 금지",
      "status": "hold"
    },
    {
      "id": "W132",
      "from": "K2:T1",
      "to": "F11:IN",
      "net": "DRIVE24",
      "kind": "power",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W133",
      "from": "F11:OUT",
      "to": "DC3:IN+",
      "net": "STEER_IN",
      "kind": "power",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W134",
      "from": "X0:STEER",
      "to": "DC3:IN-",
      "net": "0V",
      "kind": "return",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W135",
      "from": "DC3:IN-",
      "to": "DC3:OUT-",
      "net": "0V",
      "kind": "return",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W136",
      "from": "DC3:OUT+",
      "to": "OV12:IN+",
      "net": "12V_RAW",
      "kind": "steerpower",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W137",
      "from": "DC3:OUT-",
      "to": "OV12:0V",
      "net": "0V",
      "kind": "return",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W138",
      "from": "OV12:OUT+",
      "to": "X12:IN",
      "net": "12V_STEER",
      "kind": "steerpower",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W139",
      "from": "DC3:OUT-",
      "to": "X12:RETURN",
      "net": "0V",
      "kind": "return",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W140",
      "from": "X12:ABS+",
      "to": "CL12:+",
      "net": "12V_STEER",
      "kind": "steerpower",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W141",
      "from": "X12:ABS-",
      "to": "CL12:-",
      "net": "0V",
      "kind": "return",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W142",
      "from": "X12:L",
      "to": "F5:IN",
      "net": "12V_STEER",
      "kind": "steerpower",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W143",
      "from": "X12:R",
      "to": "F6:IN",
      "net": "12V_STEER",
      "kind": "steerpower",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W144",
      "from": "F5:OUT",
      "to": "JSL:PWR",
      "net": "SVL_12",
      "kind": "steerpower",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W145",
      "from": "F6:OUT",
      "to": "JSR:PWR",
      "net": "SVR_12",
      "kind": "steerpower",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W146",
      "from": "X12:L0",
      "to": "JSL:GND",
      "net": "0V",
      "kind": "return",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W147",
      "from": "X12:R0",
      "to": "JSR:GND",
      "net": "0V",
      "kind": "return",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W148",
      "from": "JSL:PWR",
      "to": "SVL:V+",
      "net": "SVL_12",
      "kind": "steerpower",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W149",
      "from": "JSL:GND",
      "to": "SVL:GND",
      "net": "0V",
      "kind": "return",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W150",
      "from": "JSR:PWR",
      "to": "SVR:V+",
      "net": "SVR_12",
      "kind": "steerpower",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W151",
      "from": "JSR:GND",
      "to": "SVR:GND",
      "net": "0V",
      "kind": "return",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W152",
      "from": "X12:LOGIC",
      "to": "F10:IN",
      "net": "12V_STEER",
      "kind": "steerpower",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W153",
      "from": "F10:OUT",
      "to": "DC4:IN+",
      "net": "PWM_SUP_IN",
      "kind": "steerpower",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W154",
      "from": "X12:LOGIC0",
      "to": "DC4:IN-",
      "net": "0V",
      "kind": "return",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W155",
      "from": "DC4:IN-",
      "to": "DC4:OUT-",
      "net": "0V",
      "kind": "return",
      "sheet": "steering",
      "gauge": "정격·실측 후 선정",
      "note": "D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.",
      "status": "hold"
    },
    {
      "id": "W156",
      "from": "X3:3V3_PWM",
      "to": "U2:1_VCC1",
      "net": "3V3",
      "kind": "logic",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W157",
      "from": "X3:0V_PWM",
      "to": "U2:4_GND1",
      "net": "0V",
      "kind": "return",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W158",
      "from": "DC4:OUT+",
      "to": "U2:8_VCC2",
      "net": "5V_SERVO_IO",
      "kind": "logic",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W159",
      "from": "DC4:OUT-",
      "to": "U2:5_GND2",
      "net": "0V",
      "kind": "return",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W160",
      "from": "U1:J2.15_IO13",
      "to": "U2:2_INA",
      "net": "PWM_L_3V3",
      "kind": "signal",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W161",
      "from": "U1:J2.12_IO14",
      "to": "U2:3_INB",
      "net": "PWM_R_3V3",
      "kind": "signal",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W162",
      "from": "U2:2_INA",
      "to": "R21:1",
      "net": "PWM_L_3V3",
      "kind": "signal",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W163",
      "from": "R21:2",
      "to": "U2:4_GND1",
      "net": "0V",
      "kind": "return",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W164",
      "from": "U2:3_INB",
      "to": "R22:1",
      "net": "PWM_R_3V3",
      "kind": "signal",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W165",
      "from": "R22:2",
      "to": "U2:4_GND1",
      "net": "0V",
      "kind": "return",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W166",
      "from": "U2:7_OUTA",
      "to": "R23:1",
      "net": "PWM_L_5V",
      "kind": "signal",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W167",
      "from": "U2:6_OUTB",
      "to": "R24:1",
      "net": "PWM_R_5V",
      "kind": "signal",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W168",
      "from": "R23:2",
      "to": "JSL:SIG",
      "net": "SVL_PWM",
      "kind": "signal",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W169",
      "from": "R24:2",
      "to": "JSR:SIG",
      "net": "SVR_PWM",
      "kind": "signal",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W170",
      "from": "JSL:SIG",
      "to": "R25:1",
      "net": "SVL_PWM",
      "kind": "signal",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W171",
      "from": "R25:2",
      "to": "JSL:GND",
      "net": "0V",
      "kind": "return",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W172",
      "from": "JSR:SIG",
      "to": "R26:1",
      "net": "SVR_PWM",
      "kind": "signal",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W173",
      "from": "R26:2",
      "to": "JSR:GND",
      "net": "0V",
      "kind": "return",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W174",
      "from": "JSL:SIG",
      "to": "SVL:PWM",
      "net": "SVL_PWM",
      "kind": "signal",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W175",
      "from": "JSR:SIG",
      "to": "SVR:PWM",
      "net": "SVR_PWM",
      "kind": "signal",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W176",
      "from": "U2:1_VCC1",
      "to": "C21:+",
      "net": "3V3",
      "kind": "logic",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W177",
      "from": "C21:-",
      "to": "U2:4_GND1",
      "net": "0V",
      "kind": "return",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W178",
      "from": "U2:8_VCC2",
      "to": "C22:+",
      "net": "5V_SERVO_IO",
      "kind": "logic",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    },
    {
      "id": "W179",
      "from": "C22:-",
      "to": "U2:5_GND2",
      "net": "0V",
      "kind": "return",
      "sheet": "pwm",
      "gauge": "짧은 신호 하네스 / 파형 확인",
      "note": "3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.",
      "status": "hold"
    }
  ],
  "gates": [
    {
      "id": "G01",
      "title": "배터리·충전기",
      "why": "24V/108Ah라는 명칭만으로 화학계·최대전압·고장전류를 알 수 없음.",
      "required": "모델명, 셀 수, 충전 상한, BMS 방전/충전/회생 허용, 지정 충전 포트, 단락 자료",
      "state": "HOLD"
    },
    {
      "id": "G02",
      "title": "구동 드라이버·모터",
      "why": "250W/24V=10.42A는 전기입력 가정일 때의 단순 값. 기계출력 정격이면 효율이 추가됨. 스톨전류는 별개.",
      "required": "브러시 DC 확인, 데이터시트, 부하전류/스톨 한계, 전류제한/가속/열 시험, 단자대 검증",
      "state": "HOLD"
    },
    {
      "id": "G03",
      "title": "퓨즈·케이블·단자",
      "why": "임의 25A/30A 표시는 부품 보호를 보장하지 않음.",
      "required": "전선 길이/단면/온도/번들, 전압강하, DC 차단용량, I²t/시간전류 협조, 접점 토크",
      "state": "HOLD"
    },
    {
      "id": "G04",
      "title": "비상정지 실모델",
      "why": "SR1·K1/K2는 기능 수준 설계. 모든 제조사 단자 번호를 아직 확정할 수 없음.",
      "required": "SR1 공식 결선, 이중 채널/교차단락/EDM/리셋 모드, 미러 NC, 코일 억제/탈락시간, 고장 주입 시험",
      "state": "HOLD"
    },
    {
      "id": "G05",
      "title": "회생·프리차지",
      "why": "K1/K2 OFF나 분기 퓨즈 단선 때도 모터는 링크에 에너지를 줄 수 있음.",
      "required": "PP/클램프/저항 실모델과 내부 결선, 로컬 링크 연결, 완충/BMS 개방/퓨즈 단선 시 최고전압·온도 시험",
      "state": "HOLD"
    },
    {
      "id": "G06",
      "title": "제어전원 보호",
      "why": "5V 컨버터 고장/USB 역급전은 센서를 손상시킬 수 있음.",
      "required": "DC1 24V 교체 확정, DC2 부하 급변/열, OV5 고장차단·전압상한, 허브 upstream/포트 전류 시험",
      "state": "HOLD"
    },
    {
      "id": "G07",
      "title": "전원 OFF 통신",
      "why": "직렬 저항은 완전한 역급전 차단이 아님.",
      "required": "ISO 모듈 OFF-state/시퀀스 검증, USB 단일 급전, 3V3 총전류, 각 모터 드라이버 command-timeout 설정/시험, UART startup/재기동, I²C 상승시간·SPI 신호·EMI 시험",
      "state": "HOLD"
    },
    {
      "id": "G08",
      "title": "기계적 제동",
      "why": "전원 차단은 브레이크가 아니며 카트가 관성·경사로 움직일 수 있음.",
      "required": "하중/속도/경사 기반 제동계 선정, 전원 상실 제동·주차 유지, 정지거리/전도 검증; 탑승 불허",
      "state": "HOLD"
    },
    {
      "id": "G09",
      "title": "상단 브래킷·배선 실측",
      "why": "마스트를 없애고 LiDAR를 전면 상단 레일로 이동. 배치 외형/케이블 길이는 추정.",
      "required": "브래킷 강성, 실제 부품 크기/체결, 적재물과 스캔면 간섭, 방수/진동/케이블 지지 확인",
      "state": "HOLD"
    },
    {
      "id": "G10",
      "title": "전방 ToF 변경에 따른 낙차 감지 상실",
      "why": "두 ToF가 전방을 보므로 기존 하향 낙차 감지는 더 이상 제공하지 않음.",
      "required": "계단/절벽/구덩이 접근을 물리적으로 통제. 필요한 경우 별도 낙차 센서 체계 승인. UWB·LiDAR·전방 ToF의 사각/광학 간섭/실외 범위 시험",
      "state": "HOLD"
    },
    {
      "id": "G11",
      "title": "전륜 조향 기구·협조 제어",
      "why": "자유 캐스터에 서보를 붙이는 것만으로 안전한 조향계가 완성되지 않음.",
      "required": "킹핀 베어링 하중경로, 링크 강도/백래시/볼조인트, 기계적 스토퍼, 최소 회전반경, 서보 양단 중심/방향/각도 캘리브레이션 및 후륜 속도 협조. 일반 차동구동 제자리 선회 명령 금지.",
      "state": "HOLD"
    },
    {
      "id": "G12",
      "title": "서보 전원·PWM·정지",
      "why": "정확한 서보 변형과 공급/입력 신호 한계·정지 거동 미확정.",
      "required": "서보 데이터시트, DC3/OV12/DC4/CL12/F5/F6 실모델, 동시 스톨·기동·회생·발열, 5V PWM 허용, MCU 정지/전원소실/재무장/비상정지 때 조향·주행 동시 시험.",
      "state": "HOLD"
    }
  ],
  "checks": [
    {
      "id": "01",
      "title": "배터리 분리·기구 고정",
      "detail": "배터리/충전기를 분리하고 금속 장신구를 제거. 바퀴를 견고하게 띄워 고정하며 작업 책임자가 주변 접근을 통제. 잔류전압을 실제 측정."
    },
    {
      "id": "02",
      "title": "모듈별 무전원 검사",
      "detail": "극성, 핀 방향, 절연, 납땜/압착, 정격/토크 확인. 전원 +와 0V 쇼트 여부는 모듈을 분리해서 검사. 커패시터 때문에 도통음만으로 판정하지 않음."
    },
    {
      "id": "03",
      "title": "컨버터 단독 시험",
      "detail": "센서/보드를 모두 분리한 뒤 전문가가 전류 제한 전원으로 DC1/DC2/OV5를 시험. 출력전압·부하 급변·과전압 차단·발열을 기록. 배터리로 첫 시험하지 않음."
    },
    {
      "id": "04",
      "title": "저전압 모듈 순차 연결",
      "detail": "SBC → 허브 → USB ESP32 → IMU/MUX/ToF → UWB → 라이다 순으로 부하를 추가. 모터 접촉기는 열린 상태. 각 단계 전압/전류/역급전을 확인."
    },
    {
      "id": "05",
      "title": "신호·단절 동작 확인",
      "detail": "ToF CH0/CH1 각각 0x29, IMU SPI, UWB 포트/ID, C1 460800 설정을 확인. UART OFF-state/USB 역급전·부팅 파형도 확인."
    },
    {
      "id": "06",
      "title": "안전회로 단독 시험",
      "detail": "모터 분리 상태에서 E-stop 각 채널 개방·채널 단락·EDM 개방·reset 고정·전원 복귀 시험. 해제만으로 재무장하지 않는지 기록. 실제 제조사 절차로 수행."
    },
    {
      "id": "07",
      "title": "전류 제한 모터 시험",
      "detail": "G01~G07 승인 이후에만 바퀴가 뜬 상태로 낮은 전류 제한·속도에서 한 모터씩 시험. 손으로 스톨을 강제하지 않음. 방향/온도/전류·프리차지·회생 최고전압 계측."
    },
    {
      "id": "08",
      "title": "정지·전도·사각 검증",
      "detail": "G08~G10은 별도 기계·동작 시험이 필요. 통신/태그 상실, MCU 멈춤, 완충/BMS 차단, 하중과 경사에서 정지 확인. 미승인 상태에서 사람 탑승·공공장소 주행 금지."
    },
    {
      "id": "09",
      "title": "서보 무부하·중립·링크 검사",
      "detail": "차체를 견고히 지지하고 바퀴 하중을 제거. 먼저 링크를 분리한 상태에서 전류 제한 전원으로 중립/방향을 확인. 실제 PWM 사양 확인 전 펄스폭을 임의 스윕하지 않는다. 서보 출력축이 차중을 지지하지 않는지 검사."
    },
    {
      "id": "10",
      "title": "전륜·후륜 협조 및 전방 시야",
      "detail": "좌우 조향 각도와 후륜 속도를 동일 회전중심으로 검증. 전원차단/통신소실 정지·경사 유지 별도 시험. 전방 ToF는 낙차 센서가 아니며 안전한 평탄 시험장 밖에서 사용하지 않는다."
    }
  ],
  "notes": {
    "dimensions": "모든 3D 치수/길이는 배치 검토용 추정. FreeCAD/STEP 원본이 아님.",
    "power": "HOLD 상태의 기능 배선 참조. 부품 실모델과 실측 시험 없이 안전을 보증하지 않음.",
    "breadboard": "브레드보드는 배터리 분리·무동력 신호시험에만 사용. 실차는 잠금형 하네스.",
    "lidar": "전면 상단 레일 / 스캔 y=0.865m 제안 / 높은 마스트 없음",
    "steering": "전륜 서보 2개 + 별도 하중지지 킹핀/링크. 제어 펌웨어·제작 승인 미포함.",
    "tof": "TOF1/2 광축 +Z(전방). 낙차 감지 기능 없음."
  },
  "sourceCommit": "cf2a2bd5bced9a97989de4bb2a884ecbb5e389a2",
  "spatial": {
    "units": "m",
    "up": [
      0,
      1,
      0
    ],
    "front": [
      0,
      0,
      1
    ],
    "lidarScanHeight": 0.865,
    "uwbCenterHeight": 0.865,
    "servoCount": 2,
    "tofDirections": [
      [
        0,
        0,
        1
      ],
      [
        0,
        0,
        1
      ]
    ],
    "measured": false
  }
};
