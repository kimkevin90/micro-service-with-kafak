1. 마이크로서비스 인증 전략

옵션 1)

- 하나의 서비스에 요청 시 로그인 유무를 판별하기 위해
  Auth Service에 JWT/Cookie 검사 요청 진행
- 권한에 대한 즉각적인 반영 가능

- Auth Service가 다운 시, 모든 서비스가 이용 불가능함

옵션 2)

- 각각의 서비스에서 JWT/Cookie 검사 진행 (Auth Service에 대한 의존성이 없음)

단점

- 그러나 JWT/Cookie 검사를 각 서비스 마다 복제해야 한다.
- 유저를 Ban할 시(Auth Service에서 hasAccess: false로 기록)해도, 즉각적인 대처 힘듬

해결방안

- 토큰 만료기간 설정 후 각 서비스에서 토큰기간 만료시 Auth Service에 refresh 토큰 요청 후 사용자에게 전달
- Auth Service에서 유저 Ban 시 이벤트 버스에 User Banned Event를 보내고, 각 서비스에서 해당 이벤트를 받아 메모리캐시에 설정한 만료기간 만큼만 Ban 유저를 기록 한다.

2. JWT 키 쿠버네티스 환경변수적용

2.1 시크릿 생성

- k create secret generic jwt-secret --from-literal=JWT_KEY=asdf
- k get secrets

  2.2 컨테이너 환경 변수 적용
  env: - name: JWT_KEY
  valueFrom:
  secretKeyRef:
  name: jwt-secret
  key: JWT_KEY

  2.3 process.env 체크 옵션 추가

- index.ts에 jwt_key 확인 후 process.env.JWT_KEY! 적용

3. JWT Payload 검사 및 권한 미들웨어 생성

- 미들웨어 미적용 시 어떤 서비스에서든 api든 JWT Payload를 추출하고 권한 검사하는 로직을 넣어야 한다.

- current-user 미들웨어 만든 후, JWT Payload 검사 및 set it on req.currentUser

- requireAuth 미들웨어 생성 후 req.currentUser 권한 확인

4. 테스팅

- 마이크로서비스의 여러 서비스들의 상호작용을 테스팅하는 것은 어렵다.
- 서비스별 독립 테스팅을 진행하지만 이벤트 버스를 포함하여 여러 서비스 테스팅과
  유사한 테스팅 목표 달성 가능

1. 기본 api 요청 핸들링 검사
2. DB 연동 모델 핸들링 검사
3. 이벤트 emit, receive 검사

4.1 Jest 테스팅

1. 인메모리에 MongoDB 카피
2. express app 실행
3. supertest 라이브러리 사용하여 express app에 fake 요청
4. 요청 테스트 확인

- 포트 지정 후 테스트 시, 여러서비스 동시에 진행하다 같은 포트 충돌 발생 가능성 있다. supertest는 express 실행 시 포트 미지정 시 임의의 포트 배정 한다. 따라서 index.ts파일과 app.ts 파일을 분리하는 것이 좋다
