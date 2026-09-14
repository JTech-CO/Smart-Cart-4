# Smart Cart D4.2

**D4.2 CAD 수정:** 기존 FCStd의 내부 ZIP 순서 때문에 새 형상 998개가 로드되지 않던 결함을 수정했습니다. 새 모델만 보려면 [D4-only FCStd](cad/Smart-Cart-D4-Only.FCStd)를 여세요. [원인과 수정](docs/CAD-DEFECT-D4.2-KR.md), [현재 검증 범위](docs/QA.md)를 확인하세요. 네 가지 브라우저 항목은 사용자 확인으로 기록했으며, 수정 FCStd의 네이티브 FreeCAD 실행은 이 환경에서 아직 미실행입니다.

[English](README.md) | 한국어

첨부 8종 부품 사양서와 서보 사진을 반영한 D4 설계를 최종 패키징하고 회귀 점검한 **정적 웹 뷰어·배선 참조·배치 검토 CAD** 묶음입니다. D4.1은 누락 자산 복구, 이전 버전 표시 정리, 점검 기록 복구 처리 및 검증 문서 갱신 리비전입니다. 회로 보호 정격이나 제작 승인을 추가로 확정하지 않습니다.

**소프트웨어 배포 패키지와 실물 통전 승인은 별개입니다. 설계 상태는 ENGINEERING HOLD이며 JDRV는 OPEN입니다.**

## 실행

ZIP을 풀고 `index.html`이 있는 폴더에서 실행합니다.

```sh
python -m http.server 8000
```

`http://localhost:8000/index.html`은 3D 조립체, `http://localhost:8000/wiring.html`은 상세 배선도입니다. Windows에서는 `py -m http.server 8000`을 사용할 수 있습니다. npm 설치·빌드·API 키·CDN은 필요하지 않습니다. 필요한 사진·스크립트·스타일은 모두 포함되어 있습니다.

GitHub Pages에는 이 폴더 **안의 내용**을 배포 루트에 복사합니다. `index.html`, `wiring.html`, `css/`, `js/`, `assets/`, `data/`, `docs/`, `.nojekyll`의 상대 구조를 유지합니다. 사용자의 저장소에 자동 업로드하거나 배포하지 않습니다. 로컬 `file://` 실행·특정 브라우저의 다운로드 제한은 별도 환경 조건이므로 HTTP 실행을 권장합니다.

## 두 화면

- `index.html`: 회전·확대·이동과 부품/전선 클릭 설명만 있는 3D 화면입니다. 키보드 방향키, +/-, Home, Escape를 지원합니다. WebGL 2 초기화가 실패하면 같은 메시를 사용하는 Canvas 2D 소프트웨어 3D로 전환합니다. 두 경로의 시각 품질은 같지 않습니다.
- `wiring.html`: 부품 외형 기반 결선도와 회로 도식, 각각 14개 시트입니다. 확대/이동, 부품/전선 선택, SVG·CSV·점검 기록 JSON 내보내기, 필터·검색·단계별 로컬 기록을 포함합니다. 108개 부품 참조번호, 246개 연결 레코드, 379개 등록 단자(외부 배선 378개 단자 + 예비 1개)가 있습니다. 숫자는 구매 수량이나 전선 가닥 수가 아닙니다.

## 설계 기준

전륜 RDS51150 2개, 전방 +Z를 보는 ToF 2개, 전면 상단 레일의 C1 LiDAR(스캔 중심 0.862m 제안), BU04 2개와 독립 BU03 태그, WROOM-32U 38핀, XRY IBT-2 PWM/EN과 AHCT 변환을 반영했습니다. 높은 LiDAR 마스트와 하향 ToF는 없습니다. 제어 펌웨어·센서 시뮬레이션·실제 카트 연결 기능은 없습니다.

## 문서와 CAD

[검증 결과](docs/QA.md) · [변경 이력](docs/CHANGELOG.md) · [통전 보류 조건](docs/SAFETY-REVIEW-KR.md) · [첨부 근거와 충돌값](docs/EVIDENCE-KR.md) · [핀·연결 기준](docs/PIN-MAP-KR.md) · [수동 시험 조건](docs/COMMISSIONING-KR.md) · [출처](docs/SOURCES.md)

[FreeCAD 사용 및 한계](cad/README-KR.md) · [FCStd](cad/Smart-Cart-D4.FCStd) · [STEP](cad/Smart-Cart-D4.step) · [재구성 매크로](cad/Rebuild-D4.FCMacro)

CAD는 원본 프로토타입 262개 객체를 숨김 참조로 보존한 D4 배치 조립체입니다. FreeCAD 네이티브 열기/저장 시험과 OpenCascade 형상 검사는 다릅니다. 실제 수행 범위를 QA에서 확인하세요. 치수공차·완전구속 스케치·구조강도·간섭·조향 운동학·제동 검증을 대신하지 않습니다.

## 재검증 및 데이터 수정

`data/design.json`을 고친 다음 아래 순서로 JSON/JS/CSV를 맞춥니다.

```sh
python tools/sync_data.py
node tests/static_regression.mjs
python tests/package_regression.py
python tests/browser_regression.py
python tests/cad_loader_regression.py
python tests/cad_regression.py
python tests/shader_regression.py
```

정적 검사는 Node.js와 Python 표준 라이브러리만 필요합니다. 브라우저 검사는 Python Playwright와 Chromium이 필요합니다. CAD 검사에는 cadquery/OCP가 필요합니다. 설치된 브라우저 경로는 `CHROMIUM_PATH` 환경변수로 지정할 수 있습니다. 시험 도구는 앱 실행 의존성이 아닙니다. 네트워크 탐색이 제한된 시험 환경에서는 `--fixture`로 같은 배포 코드를 인라인 로드하는 DOM 시험을 수행할 수 있으며, 네이티브 HTTP/저장소/다운로드 시험과 구분해 기록합니다.

`SHA256SUMS.txt`는 패키지 내부 파일 무결성 목록입니다. 소프트웨어 검사를 모두 통과해도 11개 실물 보류 조건은 해소되지 않습니다.

[원본 및 이미지 권리 고지](SOURCE-NOTICE.md)

셰이더 추가 검사에는 Linux EGL/OpenGL ES 라이브러리가 필요합니다. 이는 GLSL ES 소스의 별도 컴파일·링크·시험 픽셀 검사이며, 브라우저 WebGL 전체 장면 렌더링 시험을 대신하지 않습니다.

최종 ZIP을 다시 만들려면 `python tools/package_release.py --output ../Smart-Cart-D4.2-Fixed.zip`을 실행합니다. 내부 SHA-256 목록과 외부 ZIP 체크섬, 별도 ZIP 검증 JSON을 생성합니다. 파일 수정 후에는 먼저 필요한 회귀검사를 다시 실행하세요.
