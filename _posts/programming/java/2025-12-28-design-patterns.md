---
layout: post
title: "디자인 패턴 가이드: Builder, Factory, MVP 패턴"
date: 2025-12-28 12:07:00 +0900
categories: [programming, java]
tags: [design-pattern, builder, factory, mvp, architecture, oop]
description: "Builder 패턴, Factory 패턴, MVP 패턴 등 주요 디자인 패턴의 개념과 구현 방법을 설명합니다."
image: /assets/images/posts/thumbnails/2025-12-28-design-patterns.png
---

## Builder 패턴

Builder 패턴은 복잡한 객체의 생성 과정을 단계별로 분리하여 동일한 생성 과정에서 다른 표현을 만들 수 있게 합니다.

### 사용 시기

- 생성자에 많은 매개변수가 필요할 때
- 선택적 매개변수가 많을 때
- 불변 객체를 생성할 때

### 구현 예제 (Java)

```java
public class User {
    private final String name;
    private final int age;
    private final String email;
    private final String phone;

    private User(Builder builder) {
        this.name = builder.name;
        this.age = builder.age;
        this.email = builder.email;
        this.phone = builder.phone;
    }

    public static class Builder {
        // 필수 매개변수
        private final String name;

        // 선택적 매개변수
        private int age = 0;
        private String email = "";
        private String phone = "";

        public Builder(String name) {
            this.name = name;
        }

        public Builder age(int age) {
            this.age = age;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public User build() {
            return new User(this);
        }
    }
}

// 사용
User user = new User.Builder("John")
    .age(25)
    .email("john@example.com")
    .phone("010-1234-5678")
    .build();
```

### Kotlin에서의 Builder

Kotlin에서는 named parameters와 default values로 간단히 구현 가능:

```kotlin
data class User(
    val name: String,
    val age: Int = 0,
    val email: String = "",
    val phone: String = ""
)

// 사용
val user = User(
    name = "John",
    age = 25,
    email = "john@example.com"
)
```

---

## Factory 패턴

Factory 패턴은 객체 생성 로직을 캡슐화하여 클라이언트로부터 구체적인 클래스를 숨깁니다.

### Factory Method 패턴

```java
// 인터페이스
interface Animal {
    void speak();
}

// 구현 클래스
class Dog implements Animal {
    public void speak() {
        System.out.println("Woof!");
    }
}

class Cat implements Animal {
    public void speak() {
        System.out.println("Meow!");
    }
}

// Factory
class AnimalFactory {
    public static Animal createAnimal(String type) {
        switch (type) {
            case "dog": return new Dog();
            case "cat": return new Cat();
            default: throw new IllegalArgumentException("Unknown type");
        }
    }
}

// 사용
Animal dog = AnimalFactory.createAnimal("dog");
dog.speak();  // Woof!
```

### Abstract Factory 패턴

```java
// Abstract Factory
interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

// Concrete Factory - Windows
class WindowsFactory implements GUIFactory {
    public Button createButton() {
        return new WindowsButton();
    }
    public Checkbox createCheckbox() {
        return new WindowsCheckbox();
    }
}

// Concrete Factory - Mac
class MacFactory implements GUIFactory {
    public Button createButton() {
        return new MacButton();
    }
    public Checkbox createCheckbox() {
        return new MacCheckbox();
    }
}
```

### Builder vs Factory 비교

| 특성 | Builder | Factory |
|------|---------|---------|
| 목적 | 복잡한 객체의 단계적 생성 | 객체 생성 로직 캡슐화 |
| 반환 | 하나의 복잡한 객체 | 다양한 타입의 객체 |
| 사용 시점 | 많은 속성을 가진 객체 | 객체 타입을 런타임에 결정 |
| 메서드 체이닝 | 일반적으로 사용 | 보통 단일 메서드 |

---

## MVP (Model-View-Presenter) 패턴

MVP는 프레젠테이션 로직을 분리하는 아키텍처 패턴입니다.

### 구성 요소

- **Model**: 데이터와 비즈니스 로직
- **View**: UI 표시, 사용자 입력 처리 (Presenter에 위임)
- **Presenter**: View와 Model 사이의 중재자

### MVC vs MVP vs MVVM

| 패턴 | 특징 | 데이터 바인딩 |
|------|------|-------------|
| MVC | Controller가 View 선택 | 없음 |
| MVP | Presenter가 View 업데이트 | 없음 |
| MVVM | ViewModel이 View와 양방향 바인딩 | 있음 |

### Android에서 MVP 구현

```java
// Contract 정의
interface UserContract {
    interface View {
        void showUser(User user);
        void showError(String message);
        void showLoading();
        void hideLoading();
    }

    interface Presenter {
        void loadUser(String userId);
        void onDestroy();
    }
}

// Presenter 구현
class UserPresenter implements UserContract.Presenter {
    private UserContract.View view;
    private UserRepository repository;

    public UserPresenter(UserContract.View view, UserRepository repository) {
        this.view = view;
        this.repository = repository;
    }

    @Override
    public void loadUser(String userId) {
        view.showLoading();
        repository.getUser(userId, new Callback<User>() {
            @Override
            public void onSuccess(User user) {
                view.hideLoading();
                view.showUser(user);
            }

            @Override
            public void onError(String error) {
                view.hideLoading();
                view.showError(error);
            }
        });
    }

    @Override
    public void onDestroy() {
        view = null;
    }
}

// Activity (View) 구현
class UserActivity extends AppCompatActivity implements UserContract.View {
    private UserContract.Presenter presenter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        presenter = new UserPresenter(this, new UserRepository());
        presenter.loadUser("123");
    }

    @Override
    public void showUser(User user) {
        // UI 업데이트
    }

    @Override
    public void showError(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    @Override
    public void showLoading() {
        // 로딩 표시
    }

    @Override
    public void hideLoading() {
        // 로딩 숨김
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        presenter.onDestroy();
    }
}
```

---

## 기타 유용한 패턴

### Singleton 패턴

```java
// Thread-safe Singleton (Kotlin)
object DatabaseConnection {
    fun query(sql: String): Result { ... }
}

// Java Double-Check Locking
public class Singleton {
    private static volatile Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

### Observer 패턴

```java
// Observable
interface Subject {
    void attach(Observer o);
    void detach(Observer o);
    void notifyObservers();
}

// Observer
interface Observer {
    void update(String message);
}

// 구현
class NewsPublisher implements Subject {
    private List<Observer> observers = new ArrayList<>();
    private String latestNews;

    public void attach(Observer o) { observers.add(o); }
    public void detach(Observer o) { observers.remove(o); }

    public void notifyObservers() {
        for (Observer o : observers) {
            o.update(latestNews);
        }
    }

    public void publishNews(String news) {
        this.latestNews = news;
        notifyObservers();
    }
}
```

### Strategy 패턴

```java
// Strategy Interface
interface PaymentStrategy {
    void pay(int amount);
}

// Concrete Strategies
class CreditCardPayment implements PaymentStrategy {
    public void pay(int amount) {
        System.out.println("Paid " + amount + " with credit card");
    }
}

class PayPalPayment implements PaymentStrategy {
    public void pay(int amount) {
        System.out.println("Paid " + amount + " with PayPal");
    }
}

// Context
class ShoppingCart {
    private PaymentStrategy paymentStrategy;

    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }

    public void checkout(int amount) {
        paymentStrategy.pay(amount);
    }
}
```

---

## 패턴 선택 가이드

| 상황 | 추천 패턴 |
|------|----------|
| 복잡한 객체 생성 | Builder |
| 객체 타입 결정 위임 | Factory |
| UI 로직 분리 | MVP/MVVM |
| 전역 인스턴스 | Singleton |
| 상태 변경 알림 | Observer |
| 알고리즘 교체 | Strategy |
| 기존 클래스 인터페이스 변환 | Adapter |
| 객체 구조 순회 | Iterator |
