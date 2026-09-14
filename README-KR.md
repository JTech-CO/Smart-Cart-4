# Smart Cart D2 - 상세 배선도와 통합 3D 조립체

[English](README.md) | **한국어**

> **ENGINEERING HOLD / 통전 보류**
> 웹사이트 구현물입니다. 부품 실모델, 보호 정격, 회생, 제동과 설치 시험이 확정된 제작 승인도나 안전 인증이 아닙니다. 기존 배선/BOM을 그대로 연결하는 지시도 아닙니다.

![상단 LiDAR와 상세 전장 배치](assets/previews/3d-desktop.png)

## 두 페이지

| 파일 | 내용 |
| --- | --- |
| [index.html](index.html) | 상단 LiDAR 마스트, 원본 비율의 프레임·차동 구동·캐스터, 전장 모듈·연결 131개를 적용한 3D 조립체 |
| [wiring.html](wiring.html) | 개요 + 구동전력 + 안전정지 + 5V/USB + SPI/I²C + UART, 단자별 결선표, 첫 통전 전 점검 기록 |

55개는 **전장 참조번호 수**, 131개는 **연결 레코드 수**입니다. USB/OEM 하네스 레코드는 케이블 어셈블리 단위입니다. 이 숫자는 물리 전선 가닥 수, 전체 구매 부품 수, 완성된 와이어 컷리스트를 뜻하지 않습니다.

부품/배선 ID를 클릭해 단자와 NET을 보고 두 페이지를 오갈 수 있습니다. 3D에는 부품 검색, 전체·전장·평면·전면·하부·센서 시점, 회전/확대/이동, 커버 표시, 분해, 배선/라벨, PNG/GLB 저장이 있습니다. 분해 시에는 고정 하네스가 움직인 부품과 연결돼 보이는 오해를 막기 위해 배선을 숨깁니다.

배선도는 드래그 이동, 휠·핀치 확대, 부품/선 선택, 시트별 SVG 저장, 131개 연결 검색/필터, CSV 내보내기를 지원합니다. 노드 안의 기능 단자는 실제 커넥터의 물리적 배열을 나타내지 않습니다. 다른 선의 교차점은 접속점이 아닙니다.

## 실행

폴더 전체를 유지한 상태에서:

```sh
python -m http.server 8000
```

브라우저에서 `http://localhost:8000/index.html` 또는 `http://localhost:8000/wiring.html`을 엽니다. Windows에서는 `py -m http.server 8000`도 가능합니다. 서버는 로컬 확인용입니다. 백엔드·npm·번들러·API 키·CDN은 필요 없습니다. 코드에는 실제 모터 명령, Web Serial, WebUSB 연결이나 ROS 실행이 없습니다.

WebGL 2가 가능한 브라우저에서는 GPU 렌더러를 시도합니다. 컨텍스트 생성에 실패하면 **같은 메시를 투영하는 조작 가능한 Canvas 2D 소프트웨어 3D 렌더러**로 전환됩니다. 정적인 대체 이미지가 아닙니다. 소프트웨어 모드는 복잡한 배선 장면에서 느릴 수 있습니다. 부팅/리셋/모터 속도를 시뮬레이션하는 펌웨어는 포함하지 않습니다.

별도로 제공된 [Smart-Cart-3D-D2.html](standalone/Smart-Cart-3D-D2.html)과 [Smart-Cart-Wiring-D2.html](standalone/Smart-Cart-Wiring-D2.html)은 같은 폴더에 두는 단일 파일 실행본입니다. ZIP의 분할 소스가 유지보수·배포 기준입니다.

## Smart-Cart 저장소에 적용

이 폴더 **안의 파일**을 `Smart-Cart` 저장소 루트에 배치하면 `index.html`은 새 3D 페이지, `wiring.html`은 배선도가 됩니다. 두 페이지는 같은 `js/design-data.js`를 참조하므로 별도 데이터 복제를 수정할 필요가 없습니다. 상위 폴더를 한 겹 더 업로드하거나 ZIP 파일만 올리지 않습니다. 이전 `math.js`, `geometry.js`, `renderer.js`, `cart-model.js` 묶음과 새 스크립트를 혼합 로드하지 마세요. 새 HTML이 실제로 참조하는 파일이 기준입니다.

GitHub Pages의 배포 루트에 `.nojekyll`, `index.html`, `wiring.html`, `css/`, `js/`, `assets/`, `data/`, `docs/`가 함께 있어야 합니다. HTML의 경로는 모두 상대 경로입니다. 이 패키지를 만든 과정에서는 원격 저장소의 커밋/푸시/배포를 수행하지 않았습니다.

## D2의 주요 변경

원본 카트의 하부 LiDAR를 제거하고 스캔 중심 1.15m의 상단 마스트로 옮겼습니다. 이 높이는 **제안값**이며 적재물·기구 실측 후 확정합니다. 하향 ToF 2개는 유지하되 높은 LiDAR의 저상 장애물 사각을 완전히 해결한다고 주장하지 않습니다.

B1의 단일 자기유지 접촉기 대신 2채널 비상정지, 수동 재무장, EDM 피드백, 직렬 DC 접촉기 K1/K2 구조를 제안합니다. 프리차지는 두 접촉기의 하류, 회생 클램프/방전 저항은 각 드라이버 로컬 링크에 둡니다. 이 기능 인터페이스에는 선정·검증하지 않은 완성 모듈이 포함되며 통전 승인이 아닙니다.

기본 구성에서 조향 서보를 제외하고 DC1을 12V가 아닌 24V 안전전원으로 변경했습니다. 코일도 24V 제품 선정 전제입니다. 5V OVP/역급전 방지, ESP32 USB 단일 급전, 전원 도메인이 분리된 UART, ToF 2채널 분리를 추가했습니다. 따라서 이전 구매 BOM은 그대로 재사용할 수 없습니다.

## 문서와 데이터

- [안전 설계 검토 / 한계 / 통전 보류 조건](docs/SAFETY-REVIEW-KR.md)
- [변경 이력 및 BOM 변경 영향](docs/CHANGELOG.md)
- [조립·검증 체크시트](docs/COMMISSIONING-KR.md)
- [ESP32·센서 핀 매핑](docs/PIN-MAP-KR.md)
- [출처 및 스냅샷](docs/SOURCES.md)
- [검증 기록](docs/QA.md), [자동 검사 결과](docs/static-qa.json)
- [결선표 CSV](data/point-to-point.csv), [전장 참조 목록](data/component-register.csv), [공유 설계 JSON](data/design.json)
- [GLB 조립체](assets/models/Smart-Cart-D2.glb), [SVG 시트](assets/drawings/)

## 검사 / 내보내기 재생성

```sh
node tests/validate.mjs
```

참조 무결성·단자 NET 일치·회로 시트 완전성·3D 경로·메시·GLB를 검사하고 GLB/SVG를 다시 생성합니다. `data/design.json`과 `js/design-data.js`는 동일 데이터의 JSON/브라우저 표현입니다. 데이터를 수정하면 둘을 함께 갱신해야 합니다. 패키지에는 `tools/build_data.py`가 포함되어 있습니다.

```sh
python tools/build_data.py
node tests/validate.mjs
```

이 검사는 전압, 온도, EMI, 퓨즈 차단, 정지거리, 구조 강도 또는 안전 무결성 등급을 검사하지 않습니다. 단일 HTML 실행본은 별도 스냅샷입니다. 소스 수정 후 `python tools/bundle_standalone.py`로 다시 생성하세요.

## 형상 / 라이선스 범위

FreeCAD/STEP 원본을 불러온 모델이 아닙니다. 원본의 사진 기반 절차적 프레임 비율과 배치를 참고해 D2 조립체를 다시 구성했습니다. 하부 배터리 공간은 특히 108Ah 실물 배터리의 적합성을 증명하지 않습니다. 모든 외형·체결 위치·선 길이·선 굵기·센서 도식은 설명용입니다. [SOURCE-NOTICE](SOURCE-NOTICE.md)를 확인하세요.
