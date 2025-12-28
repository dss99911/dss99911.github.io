---
layout: post
title: "Android UI 위젯 완벽 가이드"
date: 2025-12-28 12:03:00 +0900
categories: [mobile, android]
tags: [android, ui, widget, recyclerview, constraintlayout, coordinatorlayout]
description: "Android의 다양한 UI 위젯들의 사용법을 알아봅니다. RecyclerView, ConstraintLayout, CoordinatorLayout, AppBar 등을 다룹니다."
---

# Android UI 위젯 완벽 가이드

Android에서 자주 사용되는 UI 위젯들의 사용법과 팁을 알아봅니다.

## RecyclerView

RecyclerView는 대용량 데이터셋을 효율적으로 표시하는 위젯입니다.

### 기본 설정

```kotlin
recyclerView.apply {
    layoutManager = LinearLayoutManager(context)
    adapter = myAdapter
    setHasFixedSize(true)
}
```

### Grid Layout

```xml
<androidx.recyclerview.widget.RecyclerView
    android:id="@+id/recycler_view"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    app:layoutManager="androidx.recyclerview.widget.GridLayoutManager"
    app:spanCount="2"
    tools:listitem="@layout/item_grid" />
```

### Item Decoration

```kotlin
recyclerView.addItemDecoration(
    DividerItemDecoration(context, DividerItemDecoration.VERTICAL)
)
```

### Item Animation

```kotlin
recyclerView.itemAnimator = DefaultItemAnimator()
```

### Layout Animation

```xml
<!-- res/anim/layout_animation_fall_down.xml -->
<layoutAnimation
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:animation="@anim/item_animation_fall_down"
    android:delay="15%"
    android:animationOrder="normal" />
```

```kotlin
recyclerView.layoutAnimation = AnimationUtils.loadLayoutAnimation(
    context, R.anim.layout_animation_fall_down
)
```

### 스크롤 비활성화

```xml
android:nestedScrollingEnabled="false"
```

### DiffUtil 사용

```kotlin
class UserDiffCallback : DiffUtil.ItemCallback<User>() {
    override fun areItemsTheSame(oldItem: User, newItem: User): Boolean {
        return oldItem.id == newItem.id
    }

    override fun areContentsTheSame(oldItem: User, newItem: User): Boolean {
        return oldItem == newItem
    }
}

class UserAdapter : ListAdapter<User, UserViewHolder>(UserDiffCallback()) {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UserViewHolder {
        // ViewHolder 생성
    }

    override fun onBindViewHolder(holder: UserViewHolder, position: Int) {
        holder.bind(getItem(position))
    }
}
```

## ConstraintLayout

ConstraintLayout은 복잡한 레이아웃을 플랫하게 만들 수 있는 강력한 레이아웃입니다.

### Chain 사용

```xml
<!-- 수평 체인 -->
<Button
    android:id="@+id/button1"
    app:layout_constraintHorizontal_chainStyle="spread"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintEnd_toStartOf="@id/button2" />

<Button
    android:id="@+id/button2"
    app:layout_constraintStart_toEndOf="@id/button1"
    app:layout_constraintEnd_toEndOf="parent" />
```

Chain Style 종류:
- `spread`: 균등 분배
- `spread_inside`: 양쪽 끝은 붙이고 내부만 균등 분배
- `packed`: 중앙에 모음

### Guideline

```xml
<androidx.constraintlayout.widget.Guideline
    android:id="@+id/guideline"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    app:layout_constraintGuide_percent="0.5" />
```

### Barrier

여러 뷰의 끝에 동적으로 배리어를 설정합니다.

```xml
<androidx.constraintlayout.widget.Barrier
    android:id="@+id/barrier"
    android:layout_width="0dp"
    android:layout_height="0dp"
    app:barrierDirection="end"
    app:constraint_referenced_ids="text1,text2,text3" />
```

### Group

여러 뷰의 visibility를 한번에 제어합니다.

```xml
<androidx.constraintlayout.widget.Group
    android:id="@+id/group"
    android:layout_width="0dp"
    android:layout_height="0dp"
    android:visibility="gone"
    app:constraint_referenced_ids="button1,button2,text1" />
```

### Percent 크기

```xml
<View
    android:layout_width="0dp"
    android:layout_height="0dp"
    app:layout_constraintWidth_percent="0.5"
    app:layout_constraintHeight_percent="0.3" />
```

## CoordinatorLayout

CoordinatorLayout은 자식 뷰들 간의 상호작용을 조정합니다.

### 기본 구조

```xml
<androidx.coordinatorlayout.widget.CoordinatorLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <com.google.android.material.appbar.AppBarLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content">

        <androidx.appcompat.widget.Toolbar
            android:id="@+id/toolbar"
            android:layout_width="match_parent"
            android:layout_height="?attr/actionBarSize"
            app:layout_scrollFlags="scroll|enterAlways" />

    </com.google.android.material.appbar.AppBarLayout>

    <androidx.core.widget.NestedScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_behavior="@string/appbar_scrolling_view_behavior">

        <!-- 컨텐츠 -->

    </androidx.core.widget.NestedScrollView>

    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:id="@+id/fab"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="bottom|end"
        android:layout_margin="16dp" />

</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

### Scroll Flags

- `scroll`: 스크롤 시 사라짐
- `enterAlways`: 아래로 스크롤하면 바로 나타남
- `enterAlwaysCollapsed`: 상단에서만 전체 표시
- `exitUntilCollapsed`: 최소 높이까지만 줄어듦
- `snap`: 중간 상태 없이 표시/숨김

### FAB with Snackbar

FAB이 Snackbar가 나타날 때 자동으로 위로 이동합니다.

```kotlin
Snackbar.make(view, "Message", Snackbar.LENGTH_LONG)
    .setAction("Action", null)
    .show()
```

## AppBar

### Toolbar 설정

```kotlin
setSupportActionBar(binding.toolbar)
supportActionBar?.apply {
    setDisplayHomeAsUpEnabled(true)
    setHomeAsUpIndicator(R.drawable.ic_menu)
}
```

### Up 버튼 처리

```kotlin
override fun onOptionsItemSelected(item: MenuItem): Boolean {
    return when (item.itemId) {
        android.R.id.home -> {
            onBackPressed()
            true
        }
        else -> super.onOptionsItemSelected(item)
    }
}
```

### NavigationDrawer

```xml
<com.google.android.material.navigation.NavigationView
    android:id="@+id/nav_view"
    android:layout_width="wrap_content"
    android:layout_height="match_parent"
    android:layout_gravity="start"
    app:headerLayout="@layout/nav_header"
    app:menu="@menu/drawer_menu" />
```

```kotlin
navigationView.setNavigationItemSelectedListener { menuItem ->
    when (menuItem.itemId) {
        R.id.nav_home -> { /* 처리 */ }
    }
    drawerLayout.closeDrawers()
    true
}
```

## TabLayout with ViewPager

```xml
<com.google.android.material.tabs.TabLayout
    android:id="@+id/tab_layout"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    app:tabIndicatorColor="@color/primary"
    app:tabSelectedTextColor="@color/primary" />

<androidx.viewpager2.widget.ViewPager2
    android:id="@+id/view_pager"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
```

```kotlin
TabLayoutMediator(tabLayout, viewPager) { tab, position ->
    tab.text = "Tab ${position + 1}"
}.attach()
```

## ViewStub

필요할 때만 inflate되는 경량 뷰입니다.

```xml
<ViewStub
    android:id="@+id/stub"
    android:inflatedId="@+id/inflated_layout"
    android:layout="@layout/expensive_layout"
    android:layout_width="match_parent"
    android:layout_height="wrap_content" />
```

```kotlin
binding.stub.setOnInflateListener { _, inflated ->
    // inflated 뷰 사용
}
binding.stub.inflate()
```

## View 관련 팁

### descendantFocusability

하위 뷰들의 포커스를 차단합니다.

```xml
android:descendantFocusability="blocksDescendants"
```

### clipChildren

자식 뷰가 부모 영역 밖에도 그릴 수 있게 허용합니다.

```xml
android:clipChildren="false"
```

### setAddStatesFromChildren

자식 뷰의 상태가 부모 뷰에 영향을 미치게 합니다.

```kotlin
viewGroup.setAddStatesFromChildren(true)
```

## 결론

Android의 다양한 UI 위젯들을 적절히 활용하면 복잡한 UI도 효율적으로 구현할 수 있습니다. ConstraintLayout으로 플랫한 뷰 계층을 유지하고, RecyclerView로 대용량 리스트를 처리하며, CoordinatorLayout으로 스크롤 연동 애니메이션을 구현하세요.
