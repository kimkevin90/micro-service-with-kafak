# micro-service-with-kafka

1. kafka / zookeeper 프로비저닝

- infra/kafka 디렉토리 내 zookeeper.yaml 실행
- zookeeper ClusterIP kafaka-broker에 연결

2. 각 서비스별 kafka-broker 연결

- 서비스별 kafka-wrapper 생성 후 index.ts 서비스 실행 시 연결

3. 이벤트 스토어

- topic 및 groupid 생성 후 이벤트 별 consumer & provider 생성
