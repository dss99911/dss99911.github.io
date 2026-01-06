---
layout: post
title: "iOS Development Basics - Getting Started Guide"
date: 2025-12-28
categories: [mobile, common]
tags: [ios, swift, swiftui, xcode, mobile-development]
image: /assets/images/posts/thumbnails/2025-12-28-ios-development-basics.png
---

iOS 개발을 시작하기 위한 기본 가이드입니다. SwiftUI, Xcode 설정, 라이브러리 관리 등을 다룹니다.

## iOS 개발 시작하기

### 공식 튜토리얼

Apple에서 제공하는 공식 iOS 개발 튜토리얼:

- [iOS App Development Tutorial](https://developer.apple.com/library/archive/referencelibrary/GettingStarted/DevelopiOSAppsSwift/index.html)
- [Apple Documentation](https://developer.apple.com/documentation)
- [Privacy Protection Guide](https://developer.apple.com/documentation/uikit/protecting_the_user_s_privacy)

### SwiftUI 튜토리얼

SwiftUI를 사용한 UI 개발:

- [Creating and Combining Views](https://developer.apple.com/tutorials/swiftui/creating-and-combining-views)
- [Building Lists and Navigation](https://developer.apple.com/tutorials/swiftui/building-lists-and-navigation)
- [Handling User Input with Observable](https://developer.apple.com/tutorials/swiftui/handling-user-input)

## Xcode 및 AppCode 설정

### Build Settings

**Product Bundle Identifier**
- 패키지명을 변경할 수 있습니다
- 각 Staging별로 다른 값을 설정할 수 있습니다

### Kotlin Multiplatform 연동

iOS와 Kotlin Multiplatform을 연동하는 방법:

1. [Kotlin Multiplatform Hands-on Guide](https://play.kotlinlang.org/hands-on/Targeting%20iOS%20and%20Android%20with%20Kotlin%20Multiplatform/03_CreatingSharedCode)

빌드 전에 framework 파일을 먼저 생성해야 합니다.

## Swift 코드 작성

### MARK 주석

코드 영역을 구분하고 함수 메뉴에서 쉽게 탐색할 수 있도록 MARK 주석을 사용합니다:

```swift
// MARK: - Properties
var name: String
var age: Int

// MARK: - Lifecycle
override func viewDidLoad() {
    super.viewDidLoad()
}

// MARK: - Private Methods
private func setupUI() {
    // UI 설정 코드
}
```

이 MARK 주석은 Xcode의 함수 메뉴에서 섹션 구분자로 표시됩니다.

## iOS 용어 정리

### IB (Interface Builder)

Interface Builder의 약자로, Xcode에서 UI를 시각적으로 설계하는 도구입니다.

**@IBOutlet**
- Interface Builder에서 생성한 UI 요소를 코드와 연결합니다

```swift
@IBOutlet weak var titleLabel: UILabel!
@IBOutlet weak var submitButton: UIButton!
```

**@IBAction**
- Interface Builder에서 UI 이벤트를 코드의 메서드와 연결합니다

```swift
@IBAction func submitButtonTapped(_ sender: UIButton) {
    // 버튼 탭 처리
}
```

## SF Symbols

Apple에서 제공하는 시스템 아이콘 라이브러리입니다.

- [SF Symbols Guide](https://sarunw.com/posts/sf-symbols-1/)

SF Symbols는 다양한 크기와 두께를 지원하며, SwiftUI와 UIKit 모두에서 쉽게 사용할 수 있습니다.

```swift
// SwiftUI
Image(systemName: "heart.fill")

// UIKit
let image = UIImage(systemName: "heart.fill")
```

## 의존성 관리

### CocoaPods

iOS 프로젝트의 의존성 관리자입니다.

```ruby
# Podfile
platform :ios, '13.0'

target 'MyApp' do
  use_frameworks!

  pod 'Alamofire'
  pod 'SwiftyJSON'
end
```

설치:
```bash
pod install
```

### Swift Package Manager

Xcode에 내장된 의존성 관리자로, Apple에서 권장하는 방식입니다.

1. Xcode에서 File > Add Packages 선택
2. 패키지 URL 입력
3. 버전 규칙 선택 후 추가

## 마무리

iOS 개발을 시작할 때 가장 중요한 것은 Apple의 공식 문서와 튜토리얼을 따라가는 것입니다. SwiftUI는 선언적 UI 프레임워크로 빠르게 UI를 구축할 수 있게 해주며, UIKit은 더 세밀한 제어가 필요할 때 유용합니다.
