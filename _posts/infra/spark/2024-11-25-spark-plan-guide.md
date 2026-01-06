---
layout: post
title: "Spark Plan 읽기: 기본 가이드"
date: 2024-11-25 01:57:37 +0900
categories: [infra, spark]
description: "Apache Spark 실행 계획(Spark Plan)을 읽고 이해하는 방법을 설명합니다. Logical Plan, Physical Plan의 차이와 주요 연산자, 성능 최적화 포인트를 다룹니다."
tags: [Spark, Spark Plan, Performance, Optimization, Big Data]
image: /assets/images/posts/thumbnails/2024-11-25-spark-plan-guide.png
---

# Spark Plan 읽기: 기본 가이드

---

Apache Spark에서 실행 계획(Spark Plan)을 읽고 이해하는 것은 성능 최적화와 디버깅에 매우 중요합니다. 실행 계획은 Spark가 어떻게 작업을 실행할지 보여주는 설계도로, 이를 제대로 해석하면 성능 병목현상을 파악하거나 불필요한 작업을 제거할 수 있습니다. 이 글에서는 Spark Plan을 읽기 위해 알아야 할 기본적인 개념과 주요 요소를 정리합니다.

---

## 1. Spark Plan이란?

Spark Plan은 Spark 작업이 **논리적 단계**에서 **물리적 실행**으로 변환되는 과정을 나타냅니다. 다음은 Spark Plan의 주요 단계입니다:

### 1) Logical Plan
- 사용자가 작성한 코드(`DataFrame`, SQL 등)에 대한 **논리적 표현**입니다.
- 이 단계에서는 최적화가 적용되지 않습니다.
- 예: 필터, 셀렉트 등의 기본 연산 순서.

### 2) Optimized Logical Plan
- Catalyst Optimizer가 논리적 계획을 최적화한 결과입니다.
- 필요 없는 연산 제거, 필터 조건 푸시다운, 컬럼 정리 등이 적용됩니다.

### 3) Physical Plan
- 최적화된 논리적 계획을 기반으로 실제 작업을 수행하기 위한 **실행 계획**입니다.
- 물리적 연산자(예: Scan, Shuffle, Sort)가 포함됩니다.
- 여러 대안 중에서 **비용(cost)**을 계산하여 최적의 물리적 계획을 선택합니다.

---

## 2. Spark Plan 읽기의 기본 요소

### 1) Physical Plan의 계층 구조
Spark Plan은 계층 구조(tree structure)로 표현됩니다. 각 노드는 Spark가 실행할 작업 단계를 나타냅니다.

- **최상위 노드**: 작업의 마지막 단계(예: `Sort`, `Aggregate`).
- **하위 노드**: 상위 노드가 의존하는 입력 데이터 처리(예: `Scan`, `Exchange`).

예제:
```text
== Physical Plan ==
*(2) Sort [age#10 ASC NULLS FIRST], true, 0
+- Exchange rangepartitioning(age#10 ASC NULLS FIRST, 200), REPARTITION_BY_NUM
   +- *(1) Filter (age#10 > 30)
      +- FileScan parquet [name#9, age#10] Batched: true, Format: Parquet
         PushedFilters: [GreaterThan(age, 30)]
         ReadSchema: struct<name:string,age:int>
```

•	Sort → Exchange → Filter → FileScan 순서로 작업이 실행됩니다.
•	아래에서 위로 데이터를 처리하는 방식으로 읽어야 합니다.

### 2) 주요 연산자

FileScan

	•	데이터를 읽는 연산입니다.
	•	Format: 데이터 포맷(예: Parquet, ORC).
	•	PushedFilters: 데이터 소스에서 처리된 필터 조건.
	•	ReadSchema: 읽어온 데이터의 스키마.

Filter

	•	특정 조건에 맞는 데이터를 필터링합니다.
	•	예: Filter (age#10 > 30).

Exchange

	•	데이터 재분배(Shuffle)가 발생할 때 나타납니다.
	•	예: Exchange rangepartitioning은 데이터를 범위 파티셔닝으로 재분배합니다.

Project

	•	특정 컬럼만 선택하거나, 컬럼 계산(예: SELECT)을 나타냅니다.
	•	예: Project [name#9, age#10].

Sort

	•	데이터를 정렬하는 작업입니다.
	•	예: Sort [age#10 ASC NULLS FIRST].

Aggregate

	•	데이터를 그룹화하거나 집계합니다.
	•	예: HashAggregate 또는 SortAggregate.




## 3. 실행 계획에서 성능 최적화 포인트

1) Filter Pushdown 확인

	•	PushedFilters가 포함된 FileScan을 확인하여 조건이 데이터 소스에서 처리되었는지 확인합니다.
	•	효율적인 조건을 사용하여 데이터 읽기 최적화를 극대화합니다.

2) Exchange 연산 최소화

	•	Exchange 연산은 데이터 Shuffle을 나타냅니다.
	•	Shuffle은 네트워크 및 디스크 I/O 비용이 높으므로, Shuffle이 필요한 연산을 줄이도록 코드를 최적화합니다.

3) Partitioning 확인

	•	데이터 파티셔닝이 적절한지 확인하여 병렬 처리 성능을 향상시킵니다.
	•	Exchange의 REPARTITION_BY_NUM 또는 HASH_PARTITIONING이 불필요하게 발생하는지 점검합니다.

4) Skew 데이터 처리

	•	특정 파티션에 데이터가 집중되는 Skew 문제는 성능 저하의 원인이 됩니다.
	•	Plan에서 Skew 데이터로 인한 불균형을 감지하고, 파티션 키를 변경하거나 salting을 적용합니다.

## 4. 실행 계획 확인 방법

1) DataFrame의 Plan 보기

모드 설명
* ``simple``: Print only a physical plan.
* ``extended``: Print both logical and physical plans.
* ``codegen``: Print a physical plan and generated codes if they are available.
* ``cost``: Print a logical plan and statistics if they are available.
* ``formatted``: Split explain output into two sections: a physical plan outline \
  and node details.

- 볼 때, formatted가 작업 순서대로 보여줘서, 보기 좋습니다.
- TODO: cost에서 비용을 추정할 수 있는 통계치를 알려준다는데, 어떻게 보는지 좀더 알아보면 좋을 것 같습니다.
 
```
df.explain(mode=mode)
```


 

## 5. Spark Plan 읽기 예제

다음은 Parquet 데이터를 읽고, 조건을 적용하고, 정렬하는 작업의 실행 계획입니다.

```python
df = spark.read.parquet("path/to/parquet")
filtered_df = df.filter("age > 30").orderBy("age")
filtered_df.explain()
```

실행 계획:

```
== Physical Plan ==
*(2) Sort [age#10 ASC NULLS FIRST], true, 0
+- Exchange rangepartitioning(age#10 ASC NULLS FIRST, 200), REPARTITION_BY_NUM
   +- *(1) Filter (age#10 > 30)
      +- FileScan parquet [name#9, age#10] Batched: true, Format: Parquet
         PushedFilters: [GreaterThan(age, 30)]
         ReadSchema: struct<name:string,age:int>
```

분석

1.	FileScan
    
    •	데이터 소스: Parquet.
    •	필터 조건(age > 30)이 PushedFilters로 처리됨.
2.	Filter
    
    •	Spark 레이어에서 조건이 한 번 더 적용.
3.	Exchange

    •	데이터를 정렬하기 위해 Shuffle 발생.
4.	Sort

    •	age 컬럼을 기준으로 정렬.

## 6. 결론

Spark Plan은 Spark 작업의 실행 방식을 이해하고 최적화하는 데 필수적인 도구입니다. 이를 효과적으로 읽으려면 논리적 계획과 물리적 계획의 차이를 이해하고, 주요 연산자와 성능 저하의 원인을 파악해야 합니다.
	•	Filter Pushdown으로 데이터 읽기 효율을 높이고,
	•	Shuffle 최소화로 네트워크 비용을 줄이며,
	•	파티션 구조 최적화로 병렬성을 극대화하세요.

Spark Plan을 잘 이해하면 대규모 데이터 처리에서 성능을 극대화할 수 있습니다.

