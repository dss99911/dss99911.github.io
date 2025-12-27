---
layout: post
title: "Realm Database for Android - Setup and Usage Guide"
date: 2025-12-28
categories: android
tags: [realm, android, database, kotlin, mobile-database]
---

Android에서 Realm 데이터베이스를 설정하고 사용하는 방법을 알아봅니다.

## Gradle 설정

### Project build.gradle

```gradle
buildscript {
    dependencies {
        classpath "io.realm:realm-gradle-plugin:3.4.0"
    }
}
```

### Module build.gradle

```gradle
apply plugin: 'realm-android'

dependencies {
    implementation 'io.realm:android-adapters:2.0.0'
}
```

## 초기화

```kotlin
// Application 또는 Activity에서
Realm.init(context)
```

## 기본 사용법

### Realm 인스턴스 얻기

```kotlin
val realm = Realm.getDefaultInstance()
```

### 쿼리 예시

```kotlin
// 2살 미만의 강아지 조회
val puppies = realm.where(Dog::class.java)
    .lessThan("age", 2)
    .findAll()

puppies.size  // => 0 (아직 추가된 강아지가 없음)
```

## Repository 패턴

Realm을 추상화한 Repository 인터페이스:

```kotlin
interface Repository<T> : Closeable where T : RealmModel {

    fun getById(id: String): T?

    suspend fun deleteAll()

    suspend fun delete(filter: RealmQuery<T>.() -> Unit)

    fun update(id: String, modifier: T.() -> Unit)

    fun add(item: T)

    suspend fun addAll(items: List<T>)

    fun count(filter: RealmQuery<T>.() -> Unit): Long

    fun count(): Long

    suspend fun query(
        filter: RealmQuery<T>.() -> Unit,
        sortFields: Array<String>?,
        orders: Array<Sort>?
    ): List<T>

    val clazz: Class<T>
}
```

### Repository 구현 예시

```kotlin
class DogRepository : Repository<Dog> {
    override val clazz = Dog::class.java

    override fun getById(id: String): Dog? {
        return Realm.getDefaultInstance().use { realm ->
            realm.where(clazz)
                .equalTo("id", id)
                .findFirst()
                ?.let { realm.copyFromRealm(it) }
        }
    }

    override fun add(item: Dog) {
        Realm.getDefaultInstance().use { realm ->
            realm.executeTransaction {
                it.insertOrUpdate(item)
            }
        }
    }

    override suspend fun deleteAll() {
        withContext(Dispatchers.IO) {
            Realm.getDefaultInstance().use { realm ->
                realm.executeTransaction {
                    it.delete(clazz)
                }
            }
        }
    }

    override fun count(): Long {
        return Realm.getDefaultInstance().use { realm ->
            realm.where(clazz).count()
        }
    }
}
```

## 주의사항

### Thread Safety

Realm 객체는 생성된 스레드에서만 접근할 수 있습니다.

```kotlin
// 잘못된 사용
val dog = realm.where(Dog::class.java).findFirst()
Thread {
    dog.name = "Buddy"  // 에러 발생!
}.start()

// 올바른 사용
Thread {
    Realm.getDefaultInstance().use { realm ->
        val dog = realm.where(Dog::class.java).findFirst()
        realm.executeTransaction {
            dog?.name = "Buddy"
        }
    }
}.start()
```

### Instance 관리

Realm 인스턴스는 사용 후 반드시 닫아야 합니다.

```kotlin
// use 블록 사용 (권장)
Realm.getDefaultInstance().use { realm ->
    // 사용
}

// 또는 수동으로 close
val realm = Realm.getDefaultInstance()
try {
    // 사용
} finally {
    realm.close()
}
```

## 쿼리 연산자

```kotlin
// 조건 쿼리
realm.where(Dog::class.java)
    .equalTo("name", "Buddy")
    .greaterThan("age", 1)
    .lessThan("age", 5)
    .findAll()

// 정렬
realm.where(Dog::class.java)
    .findAll()
    .sort("name", Sort.ASCENDING)

// OR 조건
realm.where(Dog::class.java)
    .equalTo("name", "Buddy")
    .or()
    .equalTo("name", "Max")
    .findAll()
```
