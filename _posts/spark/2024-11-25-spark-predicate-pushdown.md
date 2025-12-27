---
layout: post
title: "Predicate Pushdown: Spark의 데이터 읽기 최적화 기술"
date: 2024-11-25 01:57:37 +0900
categories: spark
description: "Spark Predicate Pushdown의 작동 원리와 활용 방법을 설명합니다. Parquet, ORC 파일에서 I/O 비용을 줄이고 처리 속도를 향상시키는 최적화 기법입니다."
tags: [Spark, Predicate Pushdown, Parquet, ORC, Performance, Optimization]
---

# Predicate Pushdown: Spark의 데이터 읽기 최적화 기술

---

**Spark**는 대규모 데이터를 처리하기 위한 분산 처리 엔진으로, 데이터 읽기 단계에서 **Predicate Pushdown**을 활용해 성능을 크게 향상시킬 수 있습니다. Predicate Pushdown은 데이터를 필터링하는 조건(Predicate)을 데이터 소스에 "푸시"하여 **읽기 단계에서 불필요한 데이터를 건너뛰도록 최적화**하는 기술입니다. 이 글에서는 Predicate Pushdown의 작동 원리, 장점, 한계, 그리고 활용 방법을 정리합니다.

---

## 1. Predicate Pushdown이란?

Predicate Pushdown은 Spark의 **필터 조건을 데이터 소스 레벨에서 실행**하도록 전달하는 최적화 기법입니다. 예를 들어, `WHERE age > 30`과 같은 조건이 주어지면, Spark는 이를 데이터 소스(예: Parquet, ORC)로 전달하여 **읽기 단계에서 조건에 맞는 데이터만 읽도록** 합니다. 이는 불필요한 데이터를 읽고 Spark 레이어에서 필터링하는 작업을 줄여 I/O 비용과 처리 시간을 절감합니다.

---

## 2. Predicate Pushdown의 작동 원리

### Columnar 파일 형식 (Parquet, ORC)
1. **메타데이터 기반 최적화**
    - Parquet과 ORC 파일은 각 컬럼의 **min/max 값**, **null 여부**, **통계 정보**를 메타데이터에 저장합니다.
    - Spark는 이 메타데이터를 사용해 조건에 맞지 않는 **row group** 또는 **stripe**를 스킵합니다.
2. **선택적 읽기**
    - 조건에 맞는 데이터가 포함된 **청크(row group, stripe)**만 읽습니다.
    - 읽어온 청크에서 조건에 맞는 row만 반환합니다.

### Row-based 파일 형식 (CSV, JSON)
- CSV와 JSON은 Row-based 형식으로, Predicate Pushdown을 지원하더라도 **파일 전체를 읽어야 합니다.**
- 파일을 읽은 후 각 row에 조건을 적용하여 필터링합니다.

---

## 3. Predicate Pushdown의 장점

### 1) I/O 비용 감소
- 조건에 맞지 않는 파일이나 데이터 청크를 건너뛰므로 **디스크 I/O와 네트워크 전송량**이 줄어듭니다.
- 특히, 데이터 크기가 큰 경우 효과가 큽니다.

### 2) 처리 속도 향상
- 읽어야 할 데이터 양이 줄어들어 Spark의 실행 시간이 단축됩니다.
- 데이터 소스에서 필터링을 처리하므로 Spark 클러스터의 리소스 사용량이 감소합니다.

### 3) 분산 환경 최적화
- 데이터가 분산되어 있어도 Predicate Pushdown이 적용되면 필요한 데이터만 각 노드에서 읽기 때문에 효율적입니다.

---

## 4. Predicate Pushdown의 한계

### 1) 파일 형식에 의존적
- Parquet, ORC 같은 Columnar 파일 형식에서 최적화 효과가 크지만, CSV, JSON 같은 Row-based 파일 형식에서는 제한적입니다.

### 2) 복잡한 조건 미지원
- 일부 복잡한 조건(예: UDF, `LIKE`, 서브쿼리 등)은 데이터 소스에서 처리할 수 없어 Pushdown되지 않습니다.
- 이런 조건은 Spark 레이어에서 필터링됩니다.

### 3) 메타데이터의 신뢰성
- 메타데이터가 정확하지 않거나 누락된 경우, Predicate Pushdown의 최적화 효과가 제한됩니다.

---

## 5. 활용 방법

### 1) Columnar 포맷 사용
- 데이터를 Parquet 또는 ORC 형식으로 저장하면 Predicate Pushdown을 최대한 활용할 수 있습니다.

### 2) Partitioning
- 데이터를 자주 필터링하는 조건 기준으로 파티셔닝하면, 불필요한 파티션을 스킵할 수 있어 성능이 향상됩니다.

### 3) Predicate Pushdown 적용 여부 확인
- Spark 실행 계획에서 **PushedFilters**를 확인하여 어떤 조건이 푸시되었는지 검토합니다. 예:
  ```text
  PushedFilters: [GreaterThan(age, 30), IsNotNull(name)]

4) 데이터 소스 최적화

   •	데이터 소스가 Predicate Pushdown을 지원하는지 확인합니다. 예: Hive, Delta Lake.

6. 실행 계획 예제

다음은 Parquet 파일을 읽고 조건을 적용하는 코드와 실행 계획입니다.

df = spark.read.parquet("path/to/parquet")
filtered_df = df.filter("age > 30")
filtered_df.show()

실행 계획:

== Physical Plan ==
*(1) Filter (age#10 > 30)
+- *(1) FileScan parquet [name#9, age#10] Batched: true, Format: Parquet,
PushedFilters: [GreaterThan(age,30)], ReadSchema: struct<name:string,age:int>

	•	PushedFilters: [GreaterThan(age, 30)]는 age > 30 조건이 데이터 소스에서 처리되었음을 보여줍니다.

7. 결론

Predicate Pushdown은 Spark의 성능을 크게 향상시킬 수 있는 강력한 최적화 기법입니다. 특히, Parquet 및 ORC와 같은 Columnar 파일 형식을 활용할 때 가장 큰 효과를 발휘합니다. 데이터를 효율적으로 읽고 필터링하기 위해, 데이터 형식, 파티셔닝, 조건의 단순화 등을 고려하여 설계를 최적화하세요. 이를 통해 대규모 데이터 처리 작업에서 실행 속도를 크게 향상시킬 수 있습니다.

Spark의 Predicate Pushdown을 적극 활용하여 데이터 처리 성능을 최적화해 보세요! 🚀

