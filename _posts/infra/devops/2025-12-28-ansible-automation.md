---
layout: post
title: "Ansible로 서버 관리 자동화하기"
date: 2025-12-28 12:05:00 +0900
categories: [infra, devops]
tags: [ansible, automation, devops, infrastructure, configuration-management]
description: "Ansible을 사용한 서버 관리 자동화 - 설치, Inventory, Playbook, Vault, 주요 모듈 사용법을 설명합니다."
---

# Ansible로 서버 관리 자동화하기

Ansible은 서버 관리를 자동화하는 Configuration Management 도구입니다. 관리해야 할 서버(host)가 많을 때 특히 유용합니다.

## Ansible 사용 사례

- 여러 서버를 그룹화하고 각각에 명령을 쉽게 실행
  - Deploy
  - 새 사용자 SSH 키 복사
  - 프로그램 설치
- 여러 AWS 인스턴스를 한번에 생성하고 관리
- Ansible Tower에서 여러 서버를 모니터링하고 알람 수신

## 설치

### 기본 설치

```bash
sudo pip install ansible
```

### 설치 문제 해결

설치가 안 될 경우 다음을 먼저 설치:

```bash
yum install gcc openssl-devel libffi-devel python-devel
pip install cryptography
```

### 초기 설정

Ansible 명령을 사용하려면 대상 서버에 `python-simplejson`이 필요합니다. raw 모듈을 사용하여 Python을 설치합니다:

```bash
ansible all --become -m raw -a 'sudo yum -y install python-simplejson'
```

**옵션 설명:**
- `-m`: module
- `-a`: argument
- `--become`: become sudo
- `all`: group name

## Inventory

Inventory는 그룹 정보를 나타내는 파일입니다.

**파일 위치**: `/etc/ansible/hosts`

### INI 형식 예시

```ini
[loadbalancer]
haproxy01

[web]
web01
web02
web03
web04
jeonghyeon.kim
www[01:50].example.com

[database]
mysql01
db-[a:f].example.com

[all:children]
loadbalancer
web
database
```

자세한 내용: [Ansible Inventory 문서](http://docs.ansible.com/ansible/latest/intro_inventory.html)

## 주요 모듈

### raw 모듈

단순 커맨드 명령 실행. `-m raw`를 생략해도 됩니다.

```bash
ansible all --become -m raw -a 'sudo yum -y install python-simplejson'

# 그룹에 명령 실행
ansible mysql -a "reboot -now"
```

### yum 모듈

애플리케이션 설치 및 업데이트:

```bash
# 애플리케이션 설치
ansible all -m yum -a "name=httpd state=present"

# 모든 애플리케이션 업데이트
ansible all -m yum -a "name=* state=latest"
```

### service 모듈

서비스 관리:

```bash
# 서비스 재시작
ansible mysql -m service -a "name=mysql state=restarted"

# 서비스 중지
ansible mysql -m service -a "name=mysql state=stopped"
```

### user 모듈

사용자 관리:

```bash
# 사용자 추가
ansible all -m user -a "name=gduffy comment='Griff Duffy' group=users password=amadeuppassword"

# 사용자 삭제
ansible db -m user -a "name=gduffy state=absent remove=yes"
```

### ping 모듈

연결 테스트:

```bash
ansible localhost -m ping
```

## Playbook

Playbook은 YAML 형식으로 작성된 자동화 스크립트입니다.

### 기본 실행

```bash
ansible-playbook playbook.yml
```

### playbook.yml 예시

```yaml
---
- hosts: localhost
  tasks:
    - name: get value
      debug:
        msg: "The value is: secret-value"
```

## Vault (비밀 정보 암호화)

민감한 정보를 암호화하여 관리합니다.

### 비밀 파일 생성

**secret.yml**:
```yaml
---
mysecret: secret-value
```

### 암호화

```bash
ansible-vault encrypt secret.yml
```

### Playbook에서 사용

**playbook.yml**:
```yaml
---
- hosts: localhost
  tasks:
    - name: include secret
      include_vars: secret.yml

    - name: get value
      debug:
        msg: "The value is: {{ mysecret }}"
```

### 실행

```bash
ansible-playbook --ask-vault-pass playbook.yml
```

## YAML 기본 문법

Ansible은 YAML 형식을 사용합니다.

### 기본 구조

```yaml
---
# 시작
fruits:
    - Apple
    - Orange
    - Strawberry
    - Mango
...
# 끝
```

### Dictionary

```yaml
martin:
    name: Martin D'vloper
    job: Developer
    skill: Elite
```

### 축약형

```yaml
martin: {name: Martin D'vloper, job: Developer, skill: Elite}
fruits: ['Apple', 'Orange', 'Strawberry', 'Mango']
```

### Boolean

```yaml
create_key: yes
needs_agent: no
knows_oop: True
likes_emacs: TRUE
uses_cvs: false
```

### 여러 줄 텍스트

```yaml
# 줄바꿈 유지
include_newlines: |
    exactly as you see
    will appear these three
    lines of poetry

# 줄바꿈 무시
ignore_newlines: >
    this is really a
    single line of text
    despite appearances
```

### 변수 사용

```yaml
foo: "{{ variable }}/additional/string/literal"
foo2: "{{ variable }}\\backslashes\\are\\also\\special\\characters"
foo3: "even if it's just a string literal it must all be quoted"
```

### 멀티 프로필

하나의 파일에 여러 프로필을 정의할 수 있습니다:

```yaml
spring.profiles: development
database:
  balance:
    master:
      hikari:
        ...

---
spring.profiles: stage
database:
  balance:
    master:
      hikari:
        ...

---
spring.profiles: release
...
```

## 결론

Ansible을 사용하면 여러 서버를 효율적으로 관리하고, 반복적인 작업을 자동화할 수 있습니다. Playbook과 Vault를 활용하면 보안을 유지하면서도 복잡한 인프라 구성을 코드로 관리할 수 있습니다.
