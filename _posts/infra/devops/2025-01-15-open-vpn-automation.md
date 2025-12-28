---
layout: post
title: macOS에서 스크립트로 OpenVpn 자동 연결하기
date: 2024-12-01 01:57:37 +0900
categories: [infra, devops]
---


[macOS에서 OATH Toolkit과 Keychain으로 OTP 로그인 설정하기](2024-12-01-otp.md) 를 먼저 읽고 진행해주세요.


# macOS에서 스크립트로 OpenVpn 자동 연결하기

보안을 유지하면서도, openvpn 자동 연결하는 것을 목적으로 함
보안을 위해 비밀번호들은 keychain에 저장하고,

openvpn 연결용 xcode 앱을 만들어서, 연결이 끊길 때마다 자동으로 재연결 시킴

xcode 앱은 비밀번호를 항상 읽어올 수 있는 권한을 주어서, 해당 맥북에서는 openvpn이 항상 연결되도록하고, 외부로 비밀번호는 유출되지 않아, 외부에서 openvpn을 연결할 수 없고,

xcode 앱이 위변조 된 경우에는 keychain 권한을 얻지 못하므로, 안전함.


## keychain에서 비밀번호 가져오기
아래와 같은 이유로 Xcode 앱 개발이 필요함
- security 쉘 커맨드를 사용해서 vpn에 접속하게 되면, 매번 Mac 패스워드를 입력해줘야 하는 번거로움이 있음.
- Alway allow를 하게되면, 쉘 커맨드를 호출 할 수 있는 어떠한 스크립트도 해당 비밀번호를 추출 가능.
- security 커맨드 없이 keychain에 접근하려면, xcode로 개발된 앱만 가능.


## openvpn shell script로 연결하기

```
brew install openvpn
sudo openvpn --config your-config-file.ovpn
```

`your-config-file.ovpn` 파일은 openvpn 웹사이트에서 다운 받아야 함

실행 후, Auth Username과 Password, Authenticator Code 를 입력하면 openvpn에 연결됨

여기서, username과 password는 auth-user-pass 설정으로 파일에서 읽어오고 직접적으로 입력을 생략할 수 있지만, Authenticator Code는 자동으로 입력할 수 없음

Authenticator Code를 자동으로 입력하기 위해서는
Expect 스크립트 활용해야 함
대략 아래와 같은 형태로 작성하고, expect로 실행 시킴
```bash
#!/usr/bin/expect -f

set timeout -1
spawn sudo openvpn --config your-config-file.ovpn

expect "Username:"
send "your-username\r"

expect "Password:"
send "your-password\r"

expect "Authentication code:"
send "your-authentication-code\r"

interact
```


## Xcode 앱 만들기
keychain에서 비밀번호가져오고,
위에 expect 스크립트를 xcode 앱에서 실행시키면 openvpn 자동 연결 완성


### 이슈 처리
1. Xcode command line tool로 앱을 만들면, xcode내에서 실행할 땐 잘 되는데, 실행파일을 직접 실행하면, expect에서 입력하는 값이 입력이 안되는 현상이 있음
2. xcode에서는 keychain값만 가져오고, expect는 shell script로 실행 시키는 방법도 고려해봤지만, 아래와 같은 이유로 Xcode command line tool로 keychain만 가져오는 것은 자동 로그인을 할 수 없었음 
   1. 이 경우, xcode앱을 누구나 실행 가능하여, 비밀번호를 빼돌릴 수 있음. 
   2. sudo 권한이 있는 경우만 실행이 가능하게도 해봤지만, 이 경우, 맥 재 실행시 sudo 패스워드를 매번 입력해줘야 했음
   3. launchd 로 root 권한으로 실행하는 경우, root의 keychain만 읽어올 수 있어서, 사용할 수 없었음
3. 네트워크 끊겼을 때,
   1. openvpn 커맨드에서, 네트워크 연결이 끊긴 경우, Restart pause,로그를 남기면서, exponential하게 대기를 타게 됨. 장시간 사용 안하다가 맥을 켜면, 10분씩 대기 후에 재시도를 허기도 하는데,
   2. 네트워크가 다시 연결되었다는 이벤트 발생시에, 로그를 봤을 때, 현재 대기타고 있다면, openvpn을 종료시키고 다시 실행 시키는 로직이 필요
