---
layout: post
title: "PXE Boot - 네트워크를 통한 원격 OS 설치"
date: 2026-01-11
categories: [infra, devops]
tags: [pxe, network-boot, dhcp, tftp, os-installation, bare-metal]
image: /assets/images/posts/2026-01-11-pxe-boot-network-install.png
description: "PXE(Preboot Execution Environment) Boot를 활용하여 네트워크를 통해 베어메탈 서버에 OS를 원격 설치하는 방법을 설명합니다."
---

# PXE Boot - 네트워크를 통한 원격 OS 설치

PXE(Preboot Execution Environment) Boot는 네트워크를 통해 서버를 부팅하고 운영체제를 설치하는 기술입니다. 물리 서버를 대량으로 관리해야 할 때 특히 유용합니다.

## PXE Boot란?

PXE Boot는 네트워크 서버에서 클라이언트 컴퓨터를 부팅시키고 OS를 설치하는 기술입니다.

### 주요 특징
- **베어메탈 서버 전용**: 물리 서버를 위해 설계됨 (가상화나 클라우드 환경에는 비적합)
- **네트워크 기반**: USB나 CD 없이 네트워크만으로 OS 설치 가능
- **대량 배포**: 수십~수백 대의 서버에 동시 OS 설치 가능
- **자동화**: Kickstart/Preseed와 결합하여 완전 자동 설치 가능

### 사용 시나리오
- 데이터센터의 베어메탈 서버 프로비저닝
- 대규모 서버 팜 구축
- 재설치가 빈번한 테스트 환경
- 디스크리스 워크스테이션 운영

## PXE Boot 아키텍처

PXE Boot를 위해서는 서버에 다음 구성 요소가 필요합니다:

```
+----------------+
|   PXE Server   |
+----------------+
|  Apache/Nginx  |  <- OS 이미지 호스팅
|     DHCP       |  <- IP 할당 및 PXE 정보 제공
|     TFTP       |  <- 부트로더 전송
+----------------+
        |
        | Network
        |
+----------------+
|  Client Server |  <- PXE 부팅 요청
+----------------+
```

### 필수 서비스

1. **DHCP (Dynamic Host Configuration Protocol) Server**
   - 클라이언트에 IP 주소 할당
   - PXE 부팅에 필요한 정보 제공 (TFTP 서버 주소, 부트 파일 이름)

2. **TFTP (Trivial File Transfer Protocol) Server**
   - 부트로더(pxelinux.0, grub) 전송
   - 커널 및 initrd 파일 전송

3. **HTTP/FTP Server (Apache, Nginx 등)**
   - OS 설치 이미지 및 패키지 호스팅
   - Kickstart/Preseed 설정 파일 제공

## PXE Boot 동작 과정

```
1. 클라이언트 전원 ON, PXE 부팅 선택
        |
        v
2. DHCP 요청 (IP 주소 + PXE 정보)
        |
        v
3. DHCP 응답 (IP, TFTP 서버, 부트파일명)
        |
        v
4. TFTP로 부트로더 다운로드 (pxelinux.0)
        |
        v
5. 부트로더가 커널과 initrd 다운로드
        |
        v
6. 커널 부팅, 설치 프로그램 시작
        |
        v
7. HTTP/FTP에서 설치 이미지 다운로드
        |
        v
8. OS 설치 완료
```

## 서버 구성

### 1. DHCP 서버 설정

```bash
# dhcpd.conf
subnet 192.168.1.0 netmask 255.255.255.0 {
    range 192.168.1.100 192.168.1.200;
    option routers 192.168.1.1;
    option domain-name-servers 8.8.8.8;

    # PXE 설정
    next-server 192.168.1.10;  # TFTP 서버 IP
    filename "pxelinux.0";      # 부트 파일

    # UEFI 지원
    class "pxeclients" {
        match if substring (option vendor-class-identifier, 0, 9) = "PXEClient";
        if option architecture-type = 00:07 {
            filename "grubx64.efi";  # UEFI 부팅
        } else {
            filename "pxelinux.0";   # BIOS 부팅
        }
    }
}
```

### 2. TFTP 서버 설정

```bash
# Ubuntu/Debian에서 TFTP 설치
sudo apt-get install tftpd-hpa

# /etc/default/tftpd-hpa
TFTP_USERNAME="tftp"
TFTP_DIRECTORY="/var/lib/tftpboot"
TFTP_ADDRESS=":69"
TFTP_OPTIONS="--secure"

# 서비스 시작
sudo systemctl start tftpd-hpa
sudo systemctl enable tftpd-hpa
```

### 3. TFTP 디렉토리 구성

```bash
/var/lib/tftpboot/
├── pxelinux.0              # BIOS 부트로더
├── grubx64.efi             # UEFI 부트로더
├── ldlinux.c32
├── menu.c32
├── pxelinux.cfg/
│   └── default             # 기본 메뉴 설정
├── images/
│   └── centos8/
│       ├── vmlinuz         # 커널
│       └── initrd.img      # 초기 램디스크
```

### 4. PXE 메뉴 설정

```bash
# /var/lib/tftpboot/pxelinux.cfg/default
DEFAULT menu.c32
PROMPT 0
TIMEOUT 300
ONTIMEOUT local

MENU TITLE PXE Boot Menu

LABEL centos8
    MENU LABEL Install CentOS 8
    KERNEL images/centos8/vmlinuz
    APPEND initrd=images/centos8/initrd.img inst.repo=http://192.168.1.10/centos8 inst.ks=http://192.168.1.10/ks/centos8.cfg

LABEL local
    MENU LABEL Boot from local disk
    LOCALBOOT 0
```

### 5. HTTP 서버 설정 (Apache)

```bash
# Apache 설치
sudo apt-get install apache2

# OS 이미지 마운트
sudo mkdir -p /var/www/html/centos8
sudo mount -o loop CentOS-8-x86_64-DVD.iso /var/www/html/centos8

# Apache 시작
sudo systemctl start apache2
sudo systemctl enable apache2
```

## Kickstart 자동 설치 (CentOS/RHEL)

완전 자동 설치를 위한 Kickstart 설정:

```bash
# /var/www/html/ks/centos8.cfg
#version=RHEL8
ignoredisk --only-use=sda
autopart --type=lvm
clearpart --all --initlabel

# 언어 및 키보드
lang en_US.UTF-8
keyboard us
timezone Asia/Seoul --isUtc

# 네트워크
network --bootproto=dhcp --device=eth0 --onboot=on
network --hostname=server01

# 루트 비밀번호 (암호화됨)
rootpw --iscrypted $6$xxxx...

# 설치 완료 후 재부팅
reboot

# 패키지 선택
%packages
@^minimal-environment
vim
wget
curl
%end

# 설치 후 스크립트
%post
# SSH 키 설정
mkdir -p /root/.ssh
echo "ssh-rsa AAAA..." >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys

# 기본 설정
systemctl enable sshd
%end
```

## Preseed 자동 설치 (Ubuntu/Debian)

Ubuntu/Debian용 자동 설치 설정:

```bash
# preseed.cfg
d-i debian-installer/locale string en_US
d-i keyboard-configuration/xkb-keymap select us

# 네트워크
d-i netcfg/choose_interface select auto
d-i netcfg/get_hostname string ubuntu-server

# 미러
d-i mirror/country string manual
d-i mirror/http/hostname string archive.ubuntu.com
d-i mirror/http/directory string /ubuntu

# 파티션
d-i partman-auto/method string lvm
d-i partman-auto-lvm/guided_size string max
d-i partman-auto/choose_recipe select atomic

# 사용자
d-i passwd/root-login boolean true
d-i passwd/root-password-crypted password $6$xxxx...

# 패키지
tasksel tasksel/first multiselect standard, ssh-server

# 설치 완료 후
d-i finish-install/reboot_in_progress note
```

## 클라이언트 설정

### BIOS에서 PXE 부팅 활성화

1. BIOS/UEFI 설정 진입 (F2, DEL, F12 등)
2. Boot Order에서 Network Boot / PXE Boot 활성화
3. Network Boot를 첫 번째 부팅 순서로 설정

### 일회성 PXE 부팅

대부분의 서버는 F12 키로 일회성 부팅 메뉴에 진입:
- Network Boot / PXE 선택
- OS 설치 후 자동으로 로컬 디스크로 부팅

## 고급 기능

### MAC 주소 기반 개별 설정

특정 서버에 다른 설정을 적용:

```bash
# /var/lib/tftpboot/pxelinux.cfg/01-aa-bb-cc-dd-ee-ff
# MAC 주소가 AA:BB:CC:DD:EE:FF인 서버 전용 설정

DEFAULT centos8-custom
LABEL centos8-custom
    KERNEL images/centos8/vmlinuz
    APPEND initrd=images/centos8/initrd.img inst.ks=http://192.168.1.10/ks/server-special.cfg
```

### iPXE로 기능 확장

iPXE는 PXE의 확장 버전으로 더 많은 기능 제공:

```bash
#!ipxe
dhcp
chain http://boot.example.com/menu.ipxe
```

## 트러블슈팅

### 일반적인 문제

1. **DHCP 응답 없음**
   - DHCP 서버 상태 확인
   - 방화벽에서 UDP 67, 68 포트 허용

2. **TFTP 파일 다운로드 실패**
   - TFTP 서버 상태 확인
   - 방화벽에서 UDP 69 포트 허용
   - 파일 권한 확인

3. **부트로더 로드 후 멈춤**
   - pxelinux.cfg/default 설정 확인
   - 커널/initrd 경로 확인

### 로그 확인

```bash
# DHCP 로그
tail -f /var/log/syslog | grep dhcp

# TFTP 로그
tail -f /var/log/syslog | grep tftp

# Apache 로그
tail -f /var/log/apache2/access.log
```

## 결론

PXE Boot는 대규모 베어메탈 서버 환경에서 OS 설치를 자동화하는 강력한 도구입니다:

- **효율성**: USB나 CD 없이 네트워크만으로 설치
- **확장성**: 수백 대의 서버에 동시 설치 가능
- **자동화**: Kickstart/Preseed와 결합하여 무인 설치
- **일관성**: 모든 서버에 동일한 설정 적용

클라우드 환경에서는 AMI나 이미지 기반 프로비저닝이 일반적이지만, 온프레미스 데이터센터나 베어메탈 서버 환경에서는 여전히 PXE Boot가 중요한 역할을 합니다.

## 참고 자료

- [SYSLINUX/PXELINUX 문서](https://wiki.syslinux.org/wiki/index.php?title=PXELINUX)
- [Red Hat Kickstart 가이드](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/performing_an_advanced_rhel_installation/kickstart-commands-and-options-reference_installing-rhel-as-an-experienced-user)
- [Ubuntu Preseed 문서](https://help.ubuntu.com/lts/installation-guide/amd64/apb.html)
