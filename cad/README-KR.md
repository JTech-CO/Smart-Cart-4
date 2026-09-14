# D4.2 FreeCAD 표시 결함 수정본

## 먼저 열 파일

**`Smart-Cart-D4-Only.FCStd`를 여세요.** 새 D4 조립체만 들어 있는 독립 문서입니다. 기존 프로토타입이 이 문서에 없으므로 원본과 새 모델을 혼동하지 않습니다. 원본과 함께 보관하려면 `Smart-Cart-D4.FCStd`를 사용합니다. 이 파일은 원본 262개 객체를 숨김 참조로 유지합니다. 순수 원본은 `source-prototype.FCStd`에 그대로 있습니다.

이전 D4 문서를 닫은 뒤 새 파일을 엽니다. 수정본의 시작 카메라는 D4 전체 경계 중심을 향하도록 다시 계산했습니다. 별도 매크로는 직접 열기의 필수 조건이 아닙니다. 정상적으로 열렸지만 다른 시점으로 이동한 경우 `V`, `F`를 순서대로 눌러 전체 맞춤을 할 수 있습니다.

## 확인된 결함과 수정

이전 FCStd에는 새 형상 998개의 BRep 바이트가 존재했지만, 그 ZIP 항목들이 `GuiDocument.xml`과 GUI 자료 뒤에 추가되어 있었습니다. FreeCAD의 `Base::XMLReader::readFiles`는 파일 이름을 매번 독립 검색하지 않고 등록 순서대로 한 방향으로 이동합니다. `GuiDocument.xml`에 도달할 때 아직 읽지 않은 새 형상을 건너뛰고 GUI 자료의 중첩 읽기로 들어갑니다.

소스와 같은 순차 읽기 절차를 재현한 결과 이전 파일은 새 D4 형상을 **0/998개** 읽었습니다. 수정본은 **998/998개** 읽습니다. 이전의 ZIP CRC, XML 참조 존재, 개별 BRep 유효성 검사로는 이 결함을 검출하지 못했습니다. 이전 검사 통과를 FreeCAD 호환성 승인으로 해석하면 안 됩니다.

저장 순서를 아래처럼 수정했습니다.

```text
Document.xml
문서가 참조하는 모든 형상 및 형상 매핑 자료 (등록 순서)
GuiDocument.xml
썸네일
GUI가 참조하는 재질·색상 자료 (등록 순서)
나머지 비참조 부가 자료
```

형상을 다시 그리거나 치수를 바꾸지 않았습니다. 두 수정 FCStd의 D4 BRep 998개는 이전 파일의 바이트와 동일합니다. 원본을 포함한 파일의 전체 BRep 1,247개도 동일합니다. 수정 범위는 저장 순서, 파일 구분용 문서명, 시작 카메라, 썸네일 및 별도 D4-only 문서입니다. 썸네일은 기존 웹 모델 미리보기이며 FreeCAD 실행 화면 증거가 아닙니다.

## 파일 구성

| 파일 | 내용 |
| --- | --- |
| [Smart-Cart-D4-Only.FCStd](Smart-Cart-D4-Only.FCStd) | 새 D4만: 1,004개 문서 객체, 그중 998개 형상 피처 |
| [Smart-Cart-D4.FCStd](Smart-Cart-D4.FCStd) | 원본 숨김 + D4: 1,267개 문서 객체 |
| [Smart-Cart-D4.step](Smart-Cart-D4.step) | 기존 D4 정비 상태 STEP, 바이트 변경 없음 |
| [source-prototype.FCStd](source-prototype.FCStd) | 초기 프로토타입 원본, 변경 없음 |
| [Verify-D4-Native.FCMacro](Verify-D4-Native.FCMacro) | FreeCAD 안에서 실제 열기·검사·새 이름 저장·재열기 및 JSON 기록 |
| [Rebuild-D4.FCMacro](Rebuild-D4.FCMacro) | BRep를 새 문서로 재구성하는 별도 복구 경로 |

## 네이티브 검증 매크로

`Verify-D4-Native.FCMacro`는 **현재 열려 있지 않은** 수정 FCStd 파일을 선택받습니다. FreeCAD가 실제로 복원한 998개 형상의 null/유효성, 4,664개 solid, 표시 상태를 검사합니다. 고유한 새 이름으로 저장하고 닫았다가 다시 열어 형상 수·부피·표시 상태를 비교합니다. 원본을 덮어쓰거나 기존에 열려 있던 다른 문서를 닫지 않습니다. 결과 JSON과 가능한 경우 뷰포트 PNG가 같은 폴더에 생성됩니다. 이 매크로는 사용자 실행용이며 이번 환경에서 실행한 것으로 기록하지 않았습니다.

직접 열기 문제가 계속되는 경우 `Rebuild-D4.FCMacro`로 `cad` 폴더를 선택하면 FCStd의 자동 복원 경로를 거치지 않고 BRep를 읽어 새 문서를 만들 수 있습니다. 파일 참조에 필요한 `assembly-manifest.json`과 `Smart-Cart-D4.FCStd`를 같은 폴더에 두세요.

## 검증의 경계

실행한 검사: 순차 ZIP 로더 재현, 잘못된 순서의 실패 픽스처, XML/그룹/표시 참조, 형상 바이트 보존, OpenCascade BRep 유효성, 경계 치수, STEP 비교. [현재 QA](../docs/QA.md)와 [읽기 순서 결과](../docs/cad-loader-qa.json)에 있습니다.

**이 환경에서는 FreeCAD 실행 파일·모듈을 확보하지 못했으므로 수정본을 FreeCAD 1.1.3 GUI에서 직접 열기·재저장한 시험은 아직 NOT_RUN입니다.** 파일 내 새 형상이 로더에서 건너뛰어지는 원인은 확인하고 수정했지만 GUI 실행 시험을 대신했다고 주장하지 않습니다. 사용자께서 확인한 네 가지 브라우저 항목은 사용자 검증으로 별도 기록했습니다.

## 형상과 설계 범위

D4에는 998개 형상 피처, 4,664개 solid가 있습니다. `COVER` 3개 피처의 9개 solid는 초기에는 숨겨져 있어 보이는 범위는 4,655개 solid입니다. STEP도 같은 커버 제외 범위이며, 원본 프로토타입은 STEP에 포함하지 않습니다. 서보·전방 ToF·프레임 전면 상단 LiDAR·하네스의 D4 형상은 모두 유지했습니다.

CAD는 mm, X 전방 / Y 측방 / Z 상방입니다. 웹 좌표는 m 단위이며 `[CAD.Y, CAD.Z, CAD.X] / 1000`에 대응합니다. 기본 형상 기반의 `Part::Feature` 조립체이며 완전 구속된 스케치·가공 도면이 아닙니다. **ENGINEERING HOLD / JDRV OPEN**은 변경하지 않았습니다. 이번 수정은 통전, 강도, 간섭, 조향 및 제동 승인이 아닙니다.

근거: [FreeCAD Reader.cpp](https://github.com/FreeCAD/FreeCAD/blob/main/src/Base/Reader.cpp)의 `readFiles`, `addFile` 구현.
