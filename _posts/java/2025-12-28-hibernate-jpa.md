---
layout: post
title: "Hibernate/JPA - Java ORM 프레임워크"
date: 2025-12-28
categories: [java, database]
tags: [hibernate, jpa, orm, java, database]
---

Hibernate는 Java의 대표적인 ORM(Object-Relational Mapping) 프레임워크이며, JPA(Java Persistence API)의 구현체입니다.

## Annotation 기반 설정

### 기본 엔티티 어노테이션

```java
@Entity
@Table(name= "emp500")
public class Employee {
    @Id
    private int id;
    private String firstName, lastName;
}
```

- `@Entity` - 클래스를 엔티티로 표시
- `@Table` - 테이블명 지정 (미지정시 클래스명 사용)
- `@Column` - 컬럼명 지정 (미지정시 필드명 사용)
- `@Id` - Primary Key 지정
- `@GeneratedValue` - Primary Key 자동 생성 전략

### Named Query

의미 있는 이름으로 쿼리를 정의합니다.

```java
@NamedQueries({
    @NamedQuery(
        name = "findEmployeeByName",
        query = "from Employee e where e.name = :name"
    )
})
class Employee {}
```

- [Spring Data JPA Repository Queries](http://source.lishman.com/examples/2420/spring-data-jpa-repository-queries)

### 상속 매핑

- [Hibernate 상속 매핑 튜토리얼](https://www.javatpoint.com/hibernate-table-per-hierarchy-using-annotation-tutorial-example)

#### Single Table 전략

모든 클래스가 하나의 테이블에 저장됩니다.

**Parent 클래스:**

```java
@Entity
@Table(name = "employee101")
@Inheritance(strategy=InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="type", discriminatorType=DiscriminatorType.STRING)
@DiscriminatorValue(value="employee")
public class Employee {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;
}
```

**SubClass:**

```java
@Entity
@DiscriminatorValue("regularemployee")
public class Regular_Employee extends Employee {
    @Column(name="salary")
    private float salary;

    @Column(name="bonus")
    private int bonus;
}
```

#### Table Per Class 전략

서브 테이블이 부모 클래스의 컬럼도 포함합니다.

**Parent 클래스:**

```java
@Entity
@Table(name = "employee102")
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public class Employee {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;
}
```

**SubClass:**

```java
@Entity
@Table(name="regularemployee102")
@AttributeOverrides({
    @AttributeOverride(name="id", column=@Column(name="id")),
    @AttributeOverride(name="name", column=@Column(name="name"))
})
public class Regular_Employee extends Employee {
    @Column(name="salary")
    private float salary;

    @Column(name="bonus")
    private int bonus;
}
```

#### Joined 전략

각 클래스별로 테이블이 생성되고 조인으로 조회합니다.

**Parent 클래스:**

```java
@Entity
@Table(name = "employee103")
@Inheritance(strategy=InheritanceType.JOINED)
public class Employee {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;
}
```

**SubClass:**

```java
@Entity
@Table(name="regularemployee103")
@PrimaryKeyJoinColumn(name="ID")
public class Regular_Employee extends Employee {
    @Column(name="salary")
    private float salary;

    @Column(name="bonus")
    private int bonus;
}
```

## HQL (Hibernate Query Language)

객체 지향 쿼리 언어입니다.

### Select 쿼리

```java
Query query = session.createQuery("from Emp");
query.setFirstResult(5);
query.setMaxResult(10);
List list = query.list(); // 5번째부터 10개 레코드 반환
```

### Update 쿼리

```java
Transaction tx = session.beginTransaction();
Query q = session.createQuery("update User set name=:n where id=:i");
q.setParameter("n", "Udit Kumar");
q.setParameter("i", 111);
int status = q.executeUpdate();
System.out.println(status);
tx.commit();
```

### Delete 쿼리

```java
Query query = session.createQuery("delete from Emp where id=100");
// 테이블명이 아닌 클래스명(Emp) 사용
query.executeUpdate();
```

### 집계 쿼리

```java
Query q = session.createQuery("select sum(salary) from Emp");
List<Integer> list = q.list();
System.out.println(list.get(0));
```

## HCQL (Hibernate Criteria Query Language)

where, order, limit, offset 절을 프로그래밍 방식으로 작성합니다.

- [HCQL 문서](https://www.javatpoint.com/hcql)

## Cache

### First Level Cache

- Scope: Session 객체 (애플리케이션에서 여러 세션 사용 가능)
- Default: true

### Second Level Cache

- Scope: SessionFactory (전체 애플리케이션에서 사용 가능)
- Default: false
- [Second Level Cache 문서](https://www.javatpoint.com/hibernate-second-level-cache)

## Lazy Collection

자식 객체를 필요할 때 로드합니다.

- Default: true (3.0 버전부터)

```xml
<list name="answers" lazy="true">
    <key column="qid"></key>
    <index column="type"></index>
    <one-to-many class="com.javatpoint.Answer"/>
</list>
```

## Transaction Management

```java
try {
    session = sessionFactory.openSession();
    tx = session.beginTransaction();
    // 작업 수행
    tx.commit();
} catch (Exception ex) {
    ex.printStackTrace();
    tx.rollback();
} finally {
    session.close();
}
```

## XML 설정

### hibernate.cfg.xml

```xml
<?xml version='1.0' encoding='UTF-8'?>
<!DOCTYPE hibernate-configuration PUBLIC
    "-//Hibernate/Hibernate Configuration DTD 3.0//EN"
    "http://hibernate.sourceforge.net/hibernate-configuration-3.0.dtd">

<hibernate-configuration>
    <session-factory>
        <property name="hbm2ddl.auto">update</property>
        <property name="dialect">org.hibernate.dialect.Oracle9Dialect</property>
        <property name="connection.url">jdbc:oracle:thin:@localhost:1521:xe</property>
        <property name="connection.username">system</property>
        <property name="connection.driver_class">oracle.jdbc.driver.OracleDriver</property>
        <mapping resource="question.hbm.xml"/>
    </session-factory>
</hibernate-configuration>
```

- `hbm2ddl.auto=update` - 테이블 자동 생성/업데이트
- `mapping resource` - XML 매핑 파일 지정
- `mapping class` - 어노테이션 클래스 매핑: `<mapping class="com.javatpoint.Employee"/>`

### Collection Mapping (XML)

- [Collection Mapping 문서](https://www.javatpoint.com/collection-mapping)

**Key 속성:**

```xml
<key
    column="columnname"
    on-delete="noaction|cascade"
    not-null="true|false"
    property-ref="propertyName"
    update="true|false"
    unique="true|false"
/>
```

**컬렉션 타입:** `<list>`, `<bag>`, `<set>`, `<map>`

- bag: 인덱스 없음 (순서 랜덤)
- set: bag과 유사하나 유니크

**Component Mapping:**

별도 테이블 없이 컬럼이 추가되는 방식입니다.

```xml
<class name="com.javatpoint.Employee" table="emp177">
    <id name="id">
        <generator class="increment"></generator>
    </id>
    <property name="name"></property>

    <component name="address" class="com.javatpoint.Address">
        <property name="city"></property>
        <property name="country"></property>
        <property name="pincode"></property>
    </component>
</class>
```

### Object Reference Mapping (XML)

- [One-to-One Mapping 문서](https://www.javatpoint.com/one-to-one-mapping-in-hibernate-by-one-to-one-example)

**Many-to-One:**

```xml
<class name="com.javatpoint.Employee" table="emp211">
    <id name="employeeId">
        <generator class="increment"></generator>
    </id>
    <property name="name"></property>
    <property name="email"></property>
    <many-to-one name="address" unique="true" cascade="all"></many-to-one>
</class>
```

**One-to-One:**

```xml
<class name="com.javatpoint.Employee" table="emp212">
    <id name="employeeId">
        <generator class="increment"></generator>
    </id>
    <property name="name"></property>
    <property name="email"></property>
    <one-to-one name="address" cascade="all"></one-to-one>
</class>
```

## Struts 통합

- [Hibernate와 Struts 통합](https://www.javatpoint.com/hibernate-and-struts-integration)
