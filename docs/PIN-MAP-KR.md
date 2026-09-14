# D4 단자 및 연결 기준

[단자 목록](../data/terminal-register.csv) · [단자별 결선](../data/point-to-point.csv)

그림의 좌우/상하 순서는 실물 커넥터 핀 순서가 아닙니다. 기능 단자명을 납품품 실크와 대조해야 합니다. 특히 ESP32의 GND/CMD 충돌 핀과 IBT-2 전력단자의 슬롯 순서는 확정하지 않았습니다.

## ESP32 GPIO 기능명

|기능 단자|NET|
|---|---|
|USB|USB_ESP|
|3V3_OUT|3V3|
|GND_VERIFIED|0V|
|GPIO17|PWM_ML_R_3V3|
|GPIO16|PWM_ML_L_3V3|
|GPIO25|PWM_MR_R_3V3|
|GPIO26|PWM_MR_L_3V3|
|GPIO18|IMU_SCK|
|GPIO23|IMU_MOSI|
|GPIO19|IMU_MISO|
|GPIO27|IMU_CS|
|GPIO34|IMU_INT|
|GPIO32|IMU_RST|
|GPIO21|SDA|
|GPIO22|SCL|
|GPIO33|MUX_RST|
|GPIO13|PWM_L_3V3|
|GPIO14|PWM_R_3V3|
|GPIO4|DRIVE_ARM_3V3|

## 전원 및 신호

U3/U4는 각각 14핀 AHCT125 모터 버퍼입니다. /OE에 기본 HIGH를 부여하고 구동 허용 및 출력 풀다운을 분리합니다. U2는 8핀 ISO7720F 서보 인터페이스이며 공통 0V 때문에 시스템 전체 갈바닉 절연을 주장하지 않습니다. IBT-2 IS 핀은 ADC에 연결하지 않습니다. 실제 펌웨어와 부팅·정지 조건 시험은 별도입니다.
