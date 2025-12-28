---
layout: post
title: "ELK Stack & 모니터링 시스템 구축"
date: 2025-12-28 12:15:00 +0900
categories: [infra, devops]
tags: [elk, elasticsearch, logstash, kibana, grafana, influxdb, monitoring, devops]
description: "ELK Stack(Elasticsearch, Logstash, Kibana)과 InfluxDB/Grafana를 활용한 모니터링 시스템 구축 방법을 설명합니다."
---

# ELK Stack & 모니터링 시스템 구축

로그 수집, 분석, 시각화를 위한 모니터링 시스템 구축 방법을 정리했습니다.

## 모니터링 스택 비교

### ELK Stack

```
Logstash -> Elasticsearch -> Kibana
```

### TIG Stack

```
Telegraf -> InfluxDB -> Grafana
```

## ELK Stack 데이터 흐름

1. **Logstash**: 데이터 수집, 필터링, 변환 후 Elasticsearch로 전송
2. **Elasticsearch**: 데이터 저장, 복제본 관리, 샤딩, 검색
3. **Kibana**: Elasticsearch에서 받은 데이터 시각화

### Grafana

Grafana는 별도의 시각화 도구로, 다양한 데이터 소스와 연동 가능합니다.

## Logstash

### 주요 기능

- **grok**: 비정형 데이터를 구조화된 형태로 변환
- **IP 좌표 추출**: IP 주소에서 지리 좌표 추출
- **at-least-once replay**: 데이터 유실 방지
- **플러그인 지원**: 다양한 입출력 플러그인

### 디렉토리 구조

```
/usr/share/logstash/bin
```

[Logstash 디렉토리 구조 문서](https://www.elastic.co/guide/en/logstash/6.2/dir-layout.html)

### 설정

직접 설정으로 실행:

```bash
bin/logstash -e 'input { stdin { } } output { stdout {} }'
```

## Elasticsearch

### 구조

Elasticsearch는 데이터를 효율적으로 저장하고 검색하기 위해 샤딩과 복제를 사용합니다.

#### Shard (샤드)

- 레코드를 분할하여 저장
- 분할 알고리즘이 Record ID 기반으로 분할
- 검색 시 모든 샤드를 찾지 않고, 해당 레코드가 있는 샤드만 검색
- **권장 사항**: 10GB 미만으로 유지, 너무 많이 분할해도 문제됨

#### Replica (복제본)

- 데이터 복제를 통한 고가용성 보장

#### Node (노드)

- 데이터가 분할되어 저장되는 장소

### 데이터 플로우

```
Logstash (Redis) -> Elasticsearch -> Kibana
```

- Logstash: 로그 전달
- Redis: 데이터 관리 (선택적)
- Elasticsearch: 데이터 인덱싱 및 검색
- Kibana: 시각화

## InfluxDB

InfluxDB는 시계열(Time-series) 데이터를 저장하는 데이터베이스입니다.

### 특징

- 실시간 데이터 저장에 최적화
- 높은 동시성 및 I/O 처리 성능
- 압축 알고리즘으로 저장 공간 효율성
- 유연한 확장 가능성

### 적합한 사용 사례

- 메트릭 데이터 저장
- IoT 데이터
- 실시간 모니터링

참고: [InfluxDB + Telegraf + Grafana 가이드](http://www.popit.kr/influxdb_telegraf_grafana_1/)

## 모니터링 로그 추가 시 고려사항

- Fail case에 error status code 추가
- 충분한 컨텍스트 정보 포함
- 성능에 미치는 영향 고려

## 시각화 도구

### Kibana

- Elasticsearch 전용
- 대시보드 구성
- 로그 검색 및 분석

### Grafana

- 다양한 데이터 소스 지원
- 알람 기능
- 대시보드 공유

### Tableau

- 상용 시각화 도구
- 월 $35 수준

## 참고 자료

- [ELK Stack 가이드](https://okdevtv.com/mib/elk/elk6)
- [InfluxDB + Telegraf + Grafana](http://www.popit.kr/influxdb_telegraf_grafana_1/)
- [ELK 기본](https://okdevtv.com/mib/elk)

## 아키텍처 예시

### 기본 ELK

```
Application Logs -> Logstash -> Elasticsearch -> Kibana
```

### Redis 활용

```
Application -> Logstash -> Redis -> Elasticsearch -> Kibana
```

Redis를 중간에 두어 버퍼 역할을 하게 하면 안정성이 높아집니다.

### 메트릭 모니터링

```
Telegraf (수집) -> InfluxDB (저장) -> Grafana (시각화)
```
