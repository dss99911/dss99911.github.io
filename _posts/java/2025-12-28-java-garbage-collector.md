---
layout: post
title: "Java Garbage Collector와 메모리 관리"
date: 2025-12-28 12:03:00 +0900
categories: java
tags: [java, gc, garbage-collector, memory, weakreference]
description: "Java의 Garbage Collector 동작 원리, 메모리 릭 방지, WeakReference 활용법을 알아봅니다."
---

# Java Garbage Collector와 메모리 관리

Java의 Garbage Collector(GC)가 어떻게 메모리를 관리하는지, 그리고 메모리 릭을 방지하는 방법을 살펴봅니다.

## GC의 기본 동작

GC가 데이터가 필요 없다고 판단하는 조건:
- 스레드가 종료되었을 때, 해당 스레드에서 참조하고 있던 모든 데이터를 반환합니다.
- 단, 다른 스레드가 해당 데이터를 참조하고 있다면 반환하지 못합니다.

**바로 이 지점에서 메모리 릭이 발생할 수 있습니다.**

## Anonymous 클래스와 메모리 릭

### 문제 상황

Anonymous(익명) 클래스로 구현된 인스턴스는 생성된 위치의 외부 클래스에 대한 암시적 참조(implicit reference)를 가집니다.

예를 들어, MainActivity 내의 로컬 메서드에서 생성된 익명 클래스 인스턴스는 MainActivity 인스턴스에 대한 참조를 가집니다.

```java
public class MainActivity {
    public void someMethod() {
        // 이 익명 클래스는 MainActivity에 대한 implicit reference를 가짐
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                // ...
            }
        };

        // 다른 스레드에 전달
        new Thread(runnable).start();
    }
}
```

**결과:**
- 다른 스레드가 이 anonymous 인스턴스를 가지고 있다면, MainActivity 인스턴스도 함께 참조됩니다.
- 해당 스레드가 종료되기 전까지는, 메인 스레드가 종료되어도 MainActivity 인스턴스는 GC에 의해 반환되지 않습니다.

### 해결 방법

1. **static 내부 클래스 사용**
2. **WeakReference 사용**
3. **Lambda 사용 (컨텍스트에 따라)**

## final 지역 상수의 메모리 관리

`final` 지역 변수도 해당 변수를 참조하는 객체가 없을 경우 메모리 힙에서 반환됩니다.

### 변수가 참조되는 경우

1. **해당 메서드가 호출되고 있을 때**
   - 메서드 호출 시 사용할 변수들을 모두 불러옵니다.
   - 메서드가 종료되면 일반 변수는 반환됩니다.
   - `final` 지역 상수는 메모리 힙에 있어 메서드가 끝나도 바로 반환되지 않습니다.
   - 메서드 처리 중에는 지역 변수가 해당 상수를 참조하고 있어 반환되지 않습니다.

2. **내부 anonymous class가 생성되었을 때**
   - Anonymous class는 외부 클래스에 대한 implicit reference와 함께 `final` 지역 상수에 대한 reference도 가집니다.
   - Anonymous class가 모두 반환될 때 함께 반환됩니다.

## WeakReference

`WeakReference`는 생명주기가 있는 컴포넌트를 참조할 때 유용합니다.

### 특징

- 참조하는 객체의 생명주기가 끝나면, GC가 해당 객체를 수거할 수 있습니다.
- 컴포넌트가 살아있을 때만 처리하고 싶은 경우에 사용합니다.

### 사용 예시

```java
public class PhotoManager {
    private WeakReference<PhotoView> mImageWeakRef;

    public void init(PhotoView photoView) {
        mImageWeakRef = new WeakReference<PhotoView>(photoView);
    }

    public PhotoView getPhotoView() {
        if (mImageWeakRef != null) {
            return mImageWeakRef.get();  // null이 반환될 수 있음
        }
        return null;
    }

    void recycle() {
        if (mImageWeakRef != null) {
            mImageWeakRef.clear();
            mImageWeakRef = null;
        }
    }
}
```

### 주의사항

- `WeakReference.get()`은 객체가 GC에 의해 수거되었다면 `null`을 반환합니다.
- 반환된 값은 항상 null 체크를 해야 합니다.

## Reference 타입 비교

| 타입 | 설명 | GC 동작 |
|------|------|---------|
| Strong Reference | 일반적인 참조 | 참조가 있으면 수거 안 함 |
| Weak Reference | 약한 참조 | GC 실행 시 수거 대상 |
| Soft Reference | 부드러운 참조 | 메모리 부족 시 수거 대상 |
| Phantom Reference | 유령 참조 | 이미 finalize된 객체 추적용 |

## 메모리 릭 방지 체크리스트

1. Anonymous 클래스 대신 static 내부 클래스 사용
2. 생명주기가 있는 컴포넌트는 WeakReference로 참조
3. 더 이상 필요 없는 리스너/콜백은 명시적으로 해제
4. 컬렉션에 추가한 객체는 필요 없을 때 제거
5. 스레드 작업 완료 후 참조 정리
