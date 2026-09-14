"""D3 deterministic upgrade. Retains W001-W131 and appends steering conductors."""
from pathlib import Path
import json,csv
R=Path(__file__).resolve().parents[1]
D=json.loads((R/'data/base-d2.json').read_text())
D.update(revision='D3', date='2026-09-14', baseline='후륜 독립 구동 + 전륜 개별 서보 조향 / ToF 전방 / 전면 상단 레일 LiDAR')
D['sourceCommit']='cf2a2bd5bced9a97989de4bb2a884ecbb5e389a2'
D['sources'] += [
 {'id':'R4','title':'Smart-Cart-2 / inspected D2 snapshot','url':'https://github.com/JTech-CO/Smart-Cart-2/tree/'+D['sourceCommit']},
 {'id':'S11','title':'TI ISO7720 / dual forward channels, F default-low option','url':'https://www.ti.com/product/ISO7720'},
 {'id':'S12','title':'TI ISO772x Rev.G / pin configuration and supply decoupling','url':'https://www.ti.com/lit/ds/symlink/iso7720.pdf'},
 {'id':'S13','title':'DSSERVO official website / exact RDS51150 revision still unverified','url':'https://www.dsservo.com/'}]
C={c['id']:c for c in D['components']}
C['LD1'].update(name='전면 상단 RPLIDAR C1',subtitle='전면 레일 직결 / 스캔면 약 0.865m',position=[0,.865,.489],delta='마스트 제거·전면 상단 레일 이동',direction=[0,0,1])
C['LD1']['notes']='높은 마스트 없이 전면 상단 레일의 짧은 브래킷에 장착. UWB 중심과 같은 약 0.865m 스캔 높이의 배치 제안. 손잡이·UWB·적재물이 같은 수평면을 가릴 수 있어 360° 유효 시야를 보장하지 않는다. 원본 CAD 치수 아님. 전용 하네스는 전면 레일과 우측 기둥을 따라 내려간다.'
C['A1']['position']=[.23,.353,.077]
C['A1']['notes']+=' D3에서는 USB 어댑터를 전장 트레이에 두고 전용 하네스만 전면 우측 기둥을 따라 센서로 보낸다. 연장 길이·케이블 규격은 C1 제조사 조건을 확인한다.'
for i,x in [(1,-.205),(2,.205)]:
 c=C[f'TOF{i}'];c.update(name=f'전방 ToF {i}',position=[x,.311,.551],direction=[0,0,1],delta='하향 → 전방 회전·브래킷 변경')
 c['notes']=f'전방(+Z)을 향하는 VL53L1X. CH{i-1}만 선택한 뒤 0x29 접근. VIN 3.3V / GND / SDA / SCL을 유지하며 전기적 핀 역할은 바뀌지 않는다. VDD·XSHUT·GPIO1은 NC. 광학창은 범퍼 앞쪽에 노출하되 충돌 보호 브래킷은 시야를 가리지 않는다. 이제 바닥 낙차 감지용이 아니므로 계단·절벽 감지 기능은 없다. 검출범위와 실외 성능은 실측 필요.'
for id in ['UWL','UWR']:C[id]['notes']=C[id]['notes'].replace('금속 마스트/프레임','금속 프레임/브래킷')
C['U1']['ports'].update({'J2.15_IO13':'PWM_L_3V3','J2.12_IO14':'PWM_R_3V3'})
C['U1']['notes']+=' D3: IO13(좌)/IO14(우)를 서보 PWM 입력에 사용. 5V 서보 신호나 12V 전원을 GPIO에 직접 연결하지 않는다. 펌웨어 미구현; 서보 중립·방향·동기화 검증 별도.'
C['X3']['ports'].update({'3V3_PWM':'3V3','0V_PWM':'0V'})
C['X0']['ports']['STEER']='0V'
C['K2']['notes']+=' D3의 조향 전원 F11도 T1 하류에서 분기. 접점 개방 후 회생/잔류에너지 때문에 하류가 즉시 무전압이라고 가정하지 않는다.'
def comp(id,name,sub,kind,pos,ports,notes,status='hold',source='R4',group='steering'):
 c=dict(id=id,name=name,subtitle=sub,kind=kind,group=group,position=pos,ports=dict(ports),notes=notes,status=status,source=source.split(','),delta='D3 추가')
 D['components'].append(c);C[id]=c
comp('F11','조향 입력 퓨즈','K2 하류 / DC3 입력 보호','fuse',[-.255,.35,.185],[('IN','DRIVE24'),('OUT','STEER_IN')],'K1/K2를 우회하지 않는다. DC 정격전압·차단용량·DC3 기동전류·선로 허용전류에 맞춰 선정. A값은 미정.')
comp('DC3','서보 전용 DC-DC','배터리 버스 → 12V / 20A 목표','converter',[-.185,.352,.213],[('IN+','STEER_IN'),('IN-','0V'),('OUT+','12V_RAW'),('OUT-','0V')],'제어 5V 및 안전 24V 전원과 별도. 12V/20A는 설계 목표로 확정 제품 정격 아님. 배터리 최고전압·과도전압 내압, 두 서보 동시 스톨/기동, 열저감과 실제 커넥터 전류를 시험해야 한다. 입력 차단 뒤 출력이 떨어지는 시간도 측정.')
comp('OV12','서보 전원 보호','OVP / 역전류 차단 / 전류 제한','protector',[-.098,.352,.198],[('IN+','12V_RAW'),('OUT+','12V_STEER'),('0V','0V')],'실모델 미선정인 보호 조립체. 컨버터 고장 시 입력 버스전압을 견디는 독립 OVP와 재시도/래치 동작을 정해야 한다. 최대 트립전압+오버슈트가 실제 서보 상한보다 낮아야 한다. 퓨즈만으로 서보 과전압·열손상을 막을 수 없다.')
comp('X12','서보 전원·귀환 단자대','12V / 0V 별도 절연 버스','terminal',[-.012,.352,.195],[(p,'12V_STEER') for p in ['IN','L','R','LOGIC','ABS+']]+[(p,'0V') for p in ['RETURN','L0','R0','LOGIC0','SIG0','ABS-']],'12V 군과 0V 군은 서로 절연된 두 단자군. 서보 L/R의 고전류 귀환은 별도 굵은 선으로 이곳에 모은 뒤 DC3 OUT-로 복귀. ESP32/신호선/USB로 서보 전류를 반환하지 않는다.')
comp('CL12','서보 레일 에너지 흡수','12V 로컬 클램프·방전 조립체','clamp',[-.02,.352,.270],[('+','12V_STEER'),('-','0V')],'서보의 역구동·급감속 및 입력 차단 때 발생하는 레일 상승을 평가한 후 임계값/에너지/열/방전을 선정. DC3와 OV12는 회생 에너지를 자동 흡수한다고 가정하지 않는다. 단순 TVS만으로 지속 에너지 흡수를 승인하지 않는다.')
for s,id,fi,x in [('L','SVL','F5',-.12),('R','SVR','F6',.11)]:
 comp(fi,f'{s} 서보 분기 퓨즈','전력 하네스 개별 보호','fuse',[x,.35,.291],[('IN','12V_STEER'),('OUT','SV'+s+'_12')],'실제 스톨전류·전자식 전류제한·선로/단자 허용전류·시간전류 곡선에 따라 확정. 기존 B1의 10A 숫자를 통전 승인값으로 가져오지 않는다.')
 sx=-.319 if s=='L' else .319
 comp(id,f'{s} 전륜 조향 서보','RDS51150-12V 계열 / 모델 확인','servo',[sx,.198,.288],[('V+','SV'+s+'_12'),('GND','0V'),('PWM','SV'+s+'_PWM')],'차체 고정 서보 혼 → 조정식 링크 → 킹핀 조향암. 바퀴 하중은 별도 베어링/포크가 지지하고 서보 출력축에 직접 싣지 않는다. 정확한 RDS51150 파생형·정격전압·신호 5V 허용·PWM 주기/펄스폭·스톨전류·선 순서는 실물 자료로 확인. 150kg 표기를 적재하중 150kg로 해석하지 않는다. 신호 소실 때 자유회전/유지/최종각 동작을 시험해야 한다.',source='R2,R3,S13')
 comp('JS'+s,f'{s} 서보 잠금 커넥터','전원 / 귀환 / PWM','connector',[(-.245 if s=='L' else .245),.244,.250],[(p,n) for p,n in [('PWR','SV'+s+'_12'),('GND','0V'),('SIG','SV'+s+'_PWM')]],'논리 포트명이며 구매 커넥터의 핀 1/2/3을 확정한 것이 아니다. 공급사 선색을 믿지 말고 실크/핀맵/도통으로 대조. 정격·압착·장력 완화·조향 전각의 간섭을 확인한다.')
comp('F10','PWM 전원 분기 퓨즈','12V → DC4','fuse',[.055,.353,.235],[('IN','12V_STEER'),('OUT','PWM_SUP_IN')],'12V 서보 버스의 저전류 전원 분기. 신호 회로 단락이 서보 메인 하네스를 가열하지 않게 입력 보호. 정격은 실모델 기준.')
comp('DC4','서보측 신호 전원','12V → 5V / 독립 OVP 확인','converter',[.113,.354,.211],[('IN+','PWM_SUP_IN'),('IN-','0V'),('OUT+','5V_SERVO_IO'),('OUT-','0V')],'ISO7720F 출력측 전용 5V. SBC 5V 및 ESP32 3V3와 병렬 금지. 5.5V는 ISO 공급 권장범위 상한이며 설계 목표전압이 아니다. 제품 내부 OVP·기동/차단 파형 확인.',source='S11,S12')
comp('U2','서보 PWM 인터페이스','ISO7720F / 2채널 단방향','isolator',[.207,.353,.211],[('1_VCC1','3V3'),('2_INA','PWM_L_3V3'),('3_INB','PWM_R_3V3'),('4_GND1','0V'),('5_GND2','0V'),('6_OUTB','PWM_R_5V'),('7_OUTA','PWM_L_5V'),('8_VCC2','5V_SERVO_IO')],'SOIC-8 D/DWV의 실칩 핀 번호 기준; 16핀 DW 또는 모듈 헤더 번호와 혼동 금지. VCC1=ESP 3.3V / VCC2=DC4 5V. 반드시 F(default LOW) 변형 확인. 입력측 전원 소실은 LOW로 떨어지지만 MCU가 멈춘 채 PWM을 계속 내는 고장까지 검출하지 않는다. 시스템 공통 0V이므로 전체 갈바닉 절연/안전정지 인증을 주장하지 않는다.',source='S11,S12')
for id,sub,pos,ports in [
 ('R21','10kΩ / L 입력 풀다운',[.171,.356,.167],[('1','PWM_L_3V3'),('2','0V')]),
 ('R22','10kΩ / R 입력 풀다운',[.184,.356,.167],[('1','PWM_R_3V3'),('2','0V')]),
 ('R23','220Ω / L 출력 직렬',[.208,.355,.258],[('1','PWM_L_5V'),('2','SVL_PWM')]),
 ('R24','220Ω / R 출력 직렬',[.231,.355,.258],[('1','PWM_R_5V'),('2','SVR_PWM')]),
 ('R25','10kΩ / L 수신측 풀다운',[-.231,.252,.263],[('1','SVL_PWM'),('2','0V')]),
 ('R26','10kΩ / R 수신측 풀다운',[.231,.252,.263],[('1','SVR_PWM'),('2','0V')])]:
 comp(id,'PWM '+id,sub,'resistor',pos,ports,'초기 회로 검토값. 1% 저항을 검토하며 실제 PWM 파형/케이블 용량/서보 입력 저항과 함께 확인. R25/R26은 서보 커넥터 가까이에 배치. 저항만으로 역급전이나 고장 안전을 보증하지 않는다.',status='review',source='S11,S12')
for id,pos,ports in [('C21',[.198,.356,.185],[('+','3V3'),('-','0V')]),('C22',[.232,.356,.225],[('+','5V_SERVO_IO'),('-','0V')])]:
 comp(id,'인터페이스 디커플링 '+id,'0.1µF X7R / 공급핀 바로 옆','capacitor',pos,ports,'VCC1-GND1, VCC2-GND2에 각각 0.1µF. 비극성 세라믹이며 +/−는 전원측/접지측 구분용 기능명. 모듈 내장품이면 중복 설치를 피한다.',status='review',source='S12')

def wire(a,b,kind='signal',sheet='steering',note='',gauge='정격·실측 후 선정'):
 ca,pa=a.split(':');cb,pb=b.split(':');n=C[ca]['ports'][pa];assert n==C[cb]['ports'][pb],(a,b)
 D['connections'].append(dict(id=f'W{len(D["connections"])+1:03d}',**{'from':a,'to':b},net=n,kind=kind,sheet=sheet,gauge=gauge,note=note or 'D3 전륜 서보 추가 연결. 실물 핀맵/극성/정격 확인.',status='hold' if any(C[i]['status']=='hold' for i in [ca,cb]) else 'review'))
for a,b,k in [
 ('K2:T1','F11:IN','power'),('F11:OUT','DC3:IN+','power'),('X0:STEER','DC3:IN-','return'),('DC3:IN-','DC3:OUT-','return'),
 ('DC3:OUT+','OV12:IN+','steerpower'),('DC3:OUT-','OV12:0V','return'),('OV12:OUT+','X12:IN','steerpower'),('DC3:OUT-','X12:RETURN','return'),
 ('X12:ABS+','CL12:+','steerpower'),('X12:ABS-','CL12:-','return'),
 ('X12:L','F5:IN','steerpower'),('X12:R','F6:IN','steerpower'),
 ('F5:OUT','JSL:PWR','steerpower'),('F6:OUT','JSR:PWR','steerpower'),('X12:L0','JSL:GND','return'),('X12:R0','JSR:GND','return'),
 ('JSL:PWR','SVL:V+','steerpower'),('JSL:GND','SVL:GND','return'),('JSR:PWR','SVR:V+','steerpower'),('JSR:GND','SVR:GND','return'),
 ('X12:LOGIC','F10:IN','steerpower'),('F10:OUT','DC4:IN+','steerpower'),('X12:LOGIC0','DC4:IN-','return'),('DC4:IN-','DC4:OUT-','return')]:wire(a,b,k)
for a,b,k in [
 ('X3:3V3_PWM','U2:1_VCC1','logic'),('X3:0V_PWM','U2:4_GND1','return'),('DC4:OUT+','U2:8_VCC2','logic'),('DC4:OUT-','U2:5_GND2','return'),
 ('U1:J2.15_IO13','U2:2_INA','signal'),('U1:J2.12_IO14','U2:3_INB','signal'),
 ('U2:2_INA','R21:1','signal'),('R21:2','U2:4_GND1','return'),('U2:3_INB','R22:1','signal'),('R22:2','U2:4_GND1','return'),
 ('U2:7_OUTA','R23:1','signal'),('U2:6_OUTB','R24:1','signal'),('R23:2','JSL:SIG','signal'),('R24:2','JSR:SIG','signal'),
 ('JSL:SIG','R25:1','signal'),('R25:2','JSL:GND','return'),('JSR:SIG','R26:1','signal'),('R26:2','JSR:GND','return'),
 ('JSL:SIG','SVL:PWM','signal'),('JSR:SIG','SVR:PWM','signal'),
 ('U2:1_VCC1','C21:+','logic'),('C21:-','U2:4_GND1','return'),('U2:8_VCC2','C22:+','logic'),('C22:-','U2:5_GND2','return')]:wire(a,b,k,'pwm','3.3V 입력측과 5V 출력측 양극을 절대 묶지 않음. 서보 전력귀환은 별도 선로.','짧은 신호 하네스 / 파형 확인')
D['gates'][8].update(title='상단 브래킷·배선 실측',why='마스트를 없애고 LiDAR를 전면 상단 레일로 이동. 배치 외형/케이블 길이는 추정.',required='브래킷 강성, 실제 부품 크기/체결, 적재물과 스캔면 간섭, 방수/진동/케이블 지지 확인')
D['gates'][9].update(title='전방 ToF 변경에 따른 낙차 감지 상실',why='두 ToF가 전방을 보므로 기존 하향 낙차 감지는 더 이상 제공하지 않음.',required='계단/절벽/구덩이 접근을 물리적으로 통제. 필요한 경우 별도 낙차 센서 체계 승인. UWB·LiDAR·전방 ToF의 사각/광학 간섭/실외 범위 시험')
D['gates'].extend([
 dict(id='G11',title='전륜 조향 기구·협조 제어',why='자유 캐스터에 서보를 붙이는 것만으로 안전한 조향계가 완성되지 않음.',required='킹핀 베어링 하중경로, 링크 강도/백래시/볼조인트, 기계적 스토퍼, 최소 회전반경, 서보 양단 중심/방향/각도 캘리브레이션 및 후륜 속도 협조. 일반 차동구동 제자리 선회 명령 금지.',state='HOLD'),
 dict(id='G12',title='서보 전원·PWM·정지',why='정확한 서보 변형과 공급/입력 신호 한계·정지 거동 미확정.',required='서보 데이터시트, DC3/OV12/DC4/CL12/F5/F6 실모델, 동시 스톨·기동·회생·발열, 5V PWM 허용, MCU 정지/전원소실/재무장/비상정지 때 조향·주행 동시 시험.',state='HOLD')])
D['checks'] += [dict(id='09',title='서보 무부하·중립·링크 검사',detail='차체를 견고히 지지하고 바퀴 하중을 제거. 먼저 링크를 분리한 상태에서 전류 제한 전원으로 중립/방향을 확인. 실제 PWM 사양 확인 전 펄스폭을 임의 스윕하지 않는다. 서보 출력축이 차중을 지지하지 않는지 검사.'),dict(id='10',title='전륜·후륜 협조 및 전방 시야',detail='좌우 조향 각도와 후륜 속도를 동일 회전중심으로 검증. 전원차단/통신소실 정지·경사 유지 별도 시험. 전방 ToF는 낙차 센서가 아니며 안전한 평탄 시험장 밖에서 사용하지 않는다.')]
D['notes'].update(lidar='전면 상단 레일 / 스캔 y=0.865m 제안 / 높은 마스트 없음',steering='전륜 서보 2개 + 별도 하중지지 킹핀/링크. 제어 펌웨어·제작 승인 미포함.',tof='TOF1/2 광축 +Z(전방). 낙차 감지 기능 없음.')
D['spatial']={'units':'m','up':[0,1,0],'front':[0,0,1],'lidarScanHeight':.865,'uwbCenterHeight':.865,'servoCount':2,'tofDirections':[[0,0,1],[0,0,1]],'measured':False}
# Domain/connector metadata is used by the pictorial drawing and 3D inspector alike.
for c in D['components']:
 c['terminalBasis']='기능 포트. 실물 모델·핀순서 확인'
 if c['id']=='U1':c['terminalBasis']='Espressif V4 J2/J3 표 기준 (클론/다른 보드 제외)'
 if c['id']=='U2':c['terminalBasis']='TI ISO7720F SOIC-8 D/DWV 실칩. 모듈 헤더는 별도 대조'
 if c['id'].startswith('TOF'):c['terminalBasis']='Pololu #3415 실크 이름. 커넥터 방향 실물 대조'
# Preserve original connection IDs for cross-page bookmarks.
assert all(w['id']==f'W{i+1:03d}' for i,w in enumerate(D['connections']))
assert len(C)==len(D['components'])
(R/'js/design-data.js').write_text("'use strict';\nwindow.CartDesign = "+json.dumps(D,ensure_ascii=False,indent=2)+';\n')
(R/'data/design.json').write_text(json.dumps(D,ensure_ascii=False,indent=2))
for name,records in [('point-to-point.csv',D['connections'])]:
 with (R/'data'/name).open('w',encoding='utf-8-sig',newline='') as f:
  w=csv.DictWriter(f,fieldnames=list(records[0]));w.writeheader();w.writerows(records)
with (R/'data/component-register.csv').open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.writer(f);w.writerow(['Reference','Name','Type','Group','Status','Change','TerminalBasis','Notes'])
 for c in D['components']:w.writerow([c['id'],c['name'],c['kind'],c['group'],c['status'],c['delta'],c['terminalBasis'],c['notes']])
with (R/'data/terminal-register.csv').open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.writer(f);w.writerow(['Reference','Port','Net','Basis'])
 for c in D['components']:
  for p,n in c['ports'].items():w.writerow([c['id'],p,n,c['terminalBasis']])
print(f"D3: {len(C)} components / {len(D['connections'])} connection records / {len(D['gates'])} unresolved gates")
