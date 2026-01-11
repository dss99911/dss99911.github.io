---
layout: post
title: "Android 개발 트러블슈팅 팁 모음 - View, 레이아웃, 애니메이션"
date: 2026-01-11
categories: [mobile, android]
tags: [android, troubleshooting, view, layout, animation, debugging]
---

Android 개발 중 자주 발생하는 문제들과 해결 방법을 정리했습니다.

## Touch 이벤트 관련

### getRawY vs getY 차이
- `getRawY()`: 화면 전체에서의 절대 좌표
- `getY()`: 현재 View 내에서의 상대 좌표

### ACTION_DOWN만 발생할 때
```kotlin
layout.setClickable(true)
```
클릭 가능하지 않으면 DOWN 이벤트만 발생합니다.

### Touch Event 순서
```
dispatch -> setOnTouch -> onTouch override
```

### pointerIndex out of range
touch down 없이 move가 발생하면 에러 발생합니다.

## 레이아웃 관련

### LinearLayout weight가 이상하게 적용될 때
- `width`를 `0dp`로 설정
- 부모 뷰의 크기를 고정 (wrap_content 사용 시 문제 발생)

### Gravity가 안 먹힐 때
- FrameLayout인데 LinearLayout.LayoutParams를 사용하는지 확인

### WrapContent vs 0dp + weight
```xml
<!-- 권장: 0dp 사용 -->
<View
    android:layout_width="0dp"
    android:layout_weight="1" />
```
wrap_content는 내용이 길면 예상보다 더 길게 나올 수 있습니다.

### 패딩이 안 먹힐 때
배경(background) 변경을 패딩 설정 이후에 했는지 확인합니다.

### RelativeLayout 안에 RelativeLayout
정렬이 이상하게 먹힐 수 있으므로 주의가 필요합니다.

## View 관련

### onDraw가 호출되지 않을 때
```kotlin
// Layout 클래스는 기본적으로 onDraw가 호출되지 않음
setWillNotDraw(false)
```

### View location이 안 나올 때
- View가 GONE 상태인지 확인
- 처음에 GONE이었다가 나중에 VISIBLE로 변경된 경우

### 뷰의 정확한 위치 조정
마진 대신 `setTranslation`을 사용합니다.

### bringToFront() 사용 시
addView 이후에 호출해야 합니다.

### addView 전후 LayoutParams
- addView 전: layoutParams가 null
- addView 후: layoutParams 자동 생성

## 애니메이션 관련

### 반복 애니메이션 멈춤 현상
repeat에서 duration을 변경하지 말고, update에서 변경합니다.

### 애니메이션이 잘리는 경우
뷰의 범위가 고정되어 범위 밖에서 처리 시 제대로 처리되지 않습니다.
하위 뷰도 같이 애니메이션에 추가해야 합니다.

### 애니메이션 시 이미지 깨짐
두 개의 이미지가 겹쳐져서 동시에 투명도가 변경되고 회전하는지 확인합니다.

## clipChildren / clipToPadding

### clipChildren 작동 안 할 때
```kotlin
// 부모 뷰가 패딩을 가지고 있으면 작동 안함
parentView.clipToPadding = false
```

### 특정 뷰만 clip 적용하고 싶을 때
클립차일드는 모든 부모가 false여야 합니다.

## ViewPager 관련

### 아무것도 안 나올 때
```kotlin
// instantiateItem에서 addView 필수
container.addView(view)

// isViewFromObject에서 비교 필수
override fun isViewFromObject(view: View, obj: Any) = view == obj
```

### FragmentPagerAdapter Resource Not Found
ViewPager에 id를 설정해야 합니다.

## ListView / GridView 관련

### GridView 스크롤 시 사라지는 현상
`setVerticalSpacing`과 관련이 있습니다.

### ListView item selected 안 먹힐 때
itemView가 아닌 자식 뷰에 selected를 적용해야 합니다.

## TextView 관련

### 글자 잘림
- 패딩이 처음부터 있는지 확인
- 가로 길이가 가능한 길이보다 크게 지정된 경우

### ellipsize 사용 시
```kotlin
// setSingleLine() 사용 시 앞이 잘릴 수 있음
// 멀티라인 개수를 1로 설정하는 것이 좋음
textView.maxLines = 1
```

### text baseline 정렬
- LinearLayout: 둘 다 bottom gravity
- RelativeLayout: `layout_alignBaseline` 사용

## Handler / Post 순서

```
handler -> onLayoutChange -> view.post
```

- handler는 layout 형성 전에 호출됨
- post는 뷰가 add되고 있을 때 호출되면 맨 나중에 호출
- UI thread가 놀고 있으면 먼저 호출될 수 있음

### onLayoutChanged 순서
자식 뷰의 onLayoutChanged가 먼저 호출되고, 그 후 부모 뷰가 호출됩니다.

## 기타

### Gson ListType fromJson
```kotlin
val type = object : TypeToken<ArrayList<MyClass>>(){}.getType()
gson.fromJson(json, type)
```

### 나인패치 크기 이상
- 늘어나지 않는 부분 크기 확인
- 파일명에 `.9` 명시 확인

### 로그가 안 찍힐 때
process가 같은지 확인 (uid)

### Preference 캐시
프로세스가 다르면 양쪽 다 저장해야 합니다.

### NoClassDefFoundError
clean project로 해결 (class 파일 없는 경우 발생)

### onActivityResult setResult 안 먹힐 때
`FLAG_ACTIVITY_NEW_TASK` 플래그 사용 여부 확인

### 레이아웃 변경 시 스크롤 이동
focusable을 false로 설정합니다.

### 배경이미지와 하위뷰 매칭 안 될 때
- 나인패치는 자동으로 패딩이 들어감
- 이미지 해상도가 다르면 차이 발생
