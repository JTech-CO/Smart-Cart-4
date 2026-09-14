# D4.2 CAD 표시 결함 수정 검증

이번 리비전은 **기존 FCStd의 새 D4 형상 미표시 결함**을 수정합니다. 전기적 연결, 웹 모델, JS/CSS, 배선 데이터와 STEP 형상은 변경하지 않았습니다. 브라우저 네 가지 항목의 사용자 확인과, 수정 FCStd에 대해 여기서 실행한 검사를 구분합니다.

## 사용자 환경에서 확인된 결과

사용자는 WebGL 2 전체 렌더링, 실제 HTTP·파일 탐색, 네이티브 localStorage 영속 저장, 실제 파일 다운로드 완료를 확인했다고 보고했습니다. FreeCAD 1.1.3에서는 이전 D4.1의 새 모델이 표시되지 않았습니다. [사용자 확인 기록](user-environment-confirmation.json)에 PASS 네 건과 이전 CAD FAIL을 기록했습니다. 자동화 실행 건수에 합산하지 않았습니다.

## 확인한 원인

원래 FCStd에는 새 BRep 998개가 있었지만 `GuiDocument.xml` 뒤에 추가되어 있었습니다. FreeCAD의 순차 ZIP 리더를 재현하면 **새 D4 형상 0/998개**만 복원 대상에 도달합니다. GUI 파일을 읽는 순간 아직 읽지 않은 앱 형상 등록 항목을 건너뛰기 때문입니다. 내부 순서를 바로잡은 파일에서는 **998/998개**가 복원 대상에 도달합니다.

새 형상이 실제로 없거나 도형을 숨긴 설정만의 문제가 아닙니다. 이전 검사에서 ZIP 내부 순서 검증을 빠뜨린 파일 생성 결함입니다. [상세 원인과 수정](CAD-DEFECT-D4.2-KR.md)을 참고하세요. 이전 [D4.1 보고서](QA-D4.1-HISTORICAL.md)는 이력이며 현재 FCStd의 네이티브 호환성 승인으로 사용하지 않습니다.

## 이번에 실행한 검사

| 영역 | 통과 | 실패 | 미실행 | 기록 |
| --- | ---: | ---: | ---: | --- |
| FCStd 순차 읽기, 실패 픽스처, D4-only 구조, 형상 바이트 보존 | 23 | 0 | 0 | [cad-loader-qa.json](cad-loader-qa.json) |
| FCStd XML, OpenCascade BRep, STEP 및 부피·형상 대조 | 16 | 0 | 1 | [cad-qa.json](cad-qa.json) |
| 공용 데이터·웹 모델·SVG·소스 정적 검사 재실행 | 54 | 0 | 0 | [static-qa.json](static-qa.json) |
| 파일·참조·매크로 구문·로컬 HTTP 응답 | 16 | 0 | 0 | [package-qa.json](package-qa.json) |
| 웹 실행 파일·데이터·자산 79개의 이전 ZIP 대비 바이트 일치 | 1 | 0 | 0 | [web-unchanged-qa.json](web-unchanged-qa.json) |
| **이번 실행 합계** | **110** | **0** | **1** | [QA-summary.json](QA-summary.json) |

순차 읽기 검사는 **FreeCAD의 `readFiles` 소스와 같은 파일 소비 의미를 재현한 검사**이지 FreeCAD 실행 파일을 구동한 시험은 아닙니다. 기존 파일 두 건의 비교 검사까지 포함해 23개입니다. 원래 결함 파일을 지정하지 않고 재실행하면 21개이고, 순서를 망가뜨린 메모리 픽스처 검사는 포함됩니다.

998개 D4 형상 및 원본 포함 문서의 전체 1,247개 BRep payload 바이트는 변경하지 않았습니다. 기본 문서는 1,267개 객체, 별도 D4-only 문서는 원본 없는 1,004개 객체(형상 998개 + 그룹 6개)입니다. 전체 D4 solid 수 4,664개, 커버 제외 STEP 비교 범위는 4,655개입니다. STEP 부피 비교 상대 차이는 약 2.48×10⁻¹³입니다. 이 수치는 구조강도·간섭·제조 공차 검증이 아닙니다.

내부 파일 순서를 고친 두 FCStd에 대해 새 형상 등록, 그룹 링크, 앱/GUI 표시 상태를 확인했습니다. 기존 순서대로 새 형상을 다시 GUI 자료 뒤로 옮기면 998개가 모두 건너뛰어져 회귀검사가 실패 조건을 포착합니다. ZIP CRC만 통과하는 잘못된 파일과 올바른 파일을 이제 구별합니다.

## 아직 실행하지 않은 항목

**수정본의 FreeCAD 1.1.3 네이티브 GUI 직접 열기·재저장은 NOT_RUN입니다.** 이 런타임에 FreeCAD 실행 파일·모듈이 없어 실제 GUI에서 성공했다고 표시하지 않습니다. [Verify-D4-Native.FCMacro](../cad/Verify-D4-Native.FCMacro)는 사용자 FreeCAD에서 998개 형상의 로드·유효성·solid 수·표시 상태를 검사하고, 새 이름 저장 후 다시 열어 JSON 및 가능한 뷰포트 PNG를 만드는 검증 도구입니다. 배포와 실제 실행은 다릅니다.

직접 열기의 원인이 된 파일 순서 결함은 재현해 수정했습니다. 그 이상으로 사용자 FreeCAD 버전의 모든 GUI·확장·설정 호환성까지 보증하지 않습니다. 썸네일은 기존 웹 화면을 사용했으며 네이티브 FreeCAD 스크린샷으로 제시하지 않습니다.

## 재현

프로젝트 루트에서 실행합니다.

```sh
python tests/cad_loader_regression.py
python tests/cad_regression.py
node tests/static_regression.mjs
python tests/package_regression.py
python tools/package_release.py --output ../Smart-Cart-D4.2-Fixed.zip
```

실제 결함 입력과 비교하려면 `python tests/cad_loader_regression.py --original <이전-FCStd-경로>`를 사용합니다. 원래 결함 FCStd를 새 ZIP에 포함하지 않았습니다. 복구 스크립트는 `tools/repair_fcstd_order.py`입니다. 네이티브 검사는 FreeCAD에서 `cad/Verify-D4-Native.FCMacro`를 실행합니다.

ZIP은 별도의 CRC, 항목 수, 내부 SHA-256, 원본-압축 바이트, 추출 왕복 체크섬 검사 후 배포합니다. `SHA256SUMS.txt`는 이번 패키지의 값이며 기존 ZIP 체크섬을 재사용하지 않습니다.

## 변경하지 않은 범위

웹 관련 79개 파일은 이전 최종 ZIP과 바이트가 같습니다. 회로의 부품 108개, 연결 246개와 전륜 서보·전방 ToF·레일 상단 LiDAR의 형상과 좌표도 유지됩니다. 과거 브라우저 자동화 결과를 이번 실행 합계에 재사용하지 않았고 사용자 확인은 별도 출처로 표시했습니다. 설계의 **ENGINEERING HOLD / JDRV OPEN**과 실물 시험 보류는 그대로입니다. 원격 저장소 커밋·푸시·배포는 하지 않았습니다.
