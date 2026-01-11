---
layout: post
title: "Android UI Widgets Complete Guide - Layouts, Views, and Animations"
date: 2026-01-11
categories: [mobile, android]
tags: [android, kotlin, ui, widgets, recyclerview, constraintlayout, animation]
---

Android provides a rich set of UI widgets for building modern, responsive applications. This comprehensive guide covers essential layouts, views, and animation techniques for Android development.

## Table of Contents

1. [ConstraintLayout](#constraintlayout)
2. [CoordinatorLayout](#coordinatorlayout)
3. [RecyclerView](#recyclerview)
4. [AppBar and Toolbar](#appbar-and-toolbar)
5. [ViewPager with TabLayout](#viewpager-with-tablayout)
6. [EditText and TextInputLayout](#edittext-and-textinputlayout)
7. [ViewStub](#viewstub)
8. [Navigation Drawer](#navigation-drawer)
9. [Animations](#animations)

## ConstraintLayout

ConstraintLayout is the most flexible layout system in Android, allowing complex UI designs with flat view hierarchies.

### Basic Constraints

```xml
<androidx.constraintlayout.widget.ConstraintLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:id="@+id/textView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"/>
</androidx.constraintlayout.widget.ConstraintLayout>
```

### Chains

Chains allow you to control how a group of views are positioned relative to each other:

```xml
<!-- Packed chain: Views are packed together -->
<TextView
    app:layout_constraintVertical_chainStyle="packed"
    app:layout_constraintTop_toTopOf="parent"
    app:layout_constraintBottom_toTopOf="@id/nextView"/>
```

Chain styles:
- `spread`: Views are evenly distributed (default)
- `spread_inside`: First and last views are attached to edges
- `packed`: Views are packed together

### Guideline

Guidelines are invisible lines used for positioning:

```xml
<androidx.constraintlayout.widget.Guideline
    android:id="@+id/guideline"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    app:layout_constraintGuide_percent="0.5"/>
```

### Barrier

Barriers create dynamic constraints based on multiple views:

```xml
<androidx.constraintlayout.widget.Barrier
    android:id="@+id/barrier"
    android:layout_width="0dp"
    android:layout_height="0dp"
    app:barrierDirection="end"
    app:constraint_referenced_ids="view1,view2"/>

<TextView
    app:layout_constraintStart_toEndOf="@id/barrier"/>
```

### Group

Groups allow controlling visibility of multiple views:

```xml
<androidx.constraintlayout.widget.Group
    android:layout_width="0dp"
    android:layout_height="0dp"
    android:visibility="@{model.showGroup ? View.VISIBLE : View.GONE}"
    app:constraint_referenced_ids="view1,view2,view3"/>
```

## CoordinatorLayout

CoordinatorLayout enables complex interactions between child views without custom code.

### Setup

```groovy
implementation 'com.google.android.material:material:1.9.0'
```

### FAB with Snackbar

FAB automatically moves up when Snackbar appears:

```xml
<androidx.coordinatorlayout.widget.CoordinatorLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:id="@+id/fab"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="bottom|end"
        android:layout_margin="16dp"/>
</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

### Scrolling Toolbar

Hide toolbar on scroll:

```xml
<androidx.coordinatorlayout.widget.CoordinatorLayout>

    <com.google.android.material.appbar.AppBarLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content">

        <com.google.android.material.appbar.MaterialToolbar
            android:layout_width="match_parent"
            android:layout_height="?attr/actionBarSize"
            app:layout_scrollFlags="scroll|enterAlways"/>
    </com.google.android.material.appbar.AppBarLayout>

    <androidx.core.widget.NestedScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_behavior="@string/appbar_scrolling_view_behavior">
        <!-- Content -->
    </androidx.core.widget.NestedScrollView>
</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

### Custom Behavior

Create custom interactions:

```kotlin
class FabFollowBehavior : CoordinatorLayout.Behavior<FloatingActionButton>() {

    override fun layoutDependsOn(
        parent: CoordinatorLayout,
        child: FloatingActionButton,
        dependency: View
    ): Boolean {
        return dependency is Snackbar.SnackbarLayout
    }

    override fun onDependentViewChanged(
        parent: CoordinatorLayout,
        child: FloatingActionButton,
        dependency: View
    ): Boolean {
        child.translationY = minOf(0f, dependency.translationY - dependency.height)
        return true
    }
}
```

### NestedScrollView

Use NestedScrollView for nested scrolling scenarios:

```xml
<androidx.core.widget.NestedScrollView
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical">
        <!-- Nested RecyclerView works properly here -->
    </LinearLayout>
</androidx.core.widget.NestedScrollView>
```

## RecyclerView

RecyclerView is the standard way to display large lists efficiently.

### Basic Setup

```kotlin
recyclerView.layoutManager = LinearLayoutManager(context)
recyclerView.adapter = myAdapter
```

### Layout Managers

```kotlin
// Linear (vertical)
recyclerView.layoutManager = LinearLayoutManager(context)

// Linear (horizontal)
recyclerView.layoutManager = LinearLayoutManager(context, LinearLayoutManager.HORIZONTAL, false)

// Grid
recyclerView.layoutManager = GridLayoutManager(context, 2)

// Staggered Grid
recyclerView.layoutManager = StaggeredGridLayoutManager(2, StaggeredGridLayoutManager.VERTICAL)
```

### XML Configuration

```xml
<androidx.recyclerview.widget.RecyclerView
    android:id="@+id/recyclerView"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:paddingHorizontal="4dp"
    app:layoutManager="androidx.recyclerview.widget.GridLayoutManager"
    app:spanCount="2"
    tools:itemCount="5"
    tools:listitem="@layout/item_layout"/>
```

### Item Decoration

Add spacing between items:

```kotlin
class VerticalSpaceItemDecoration(private val space: Int) : RecyclerView.ItemDecoration() {
    override fun getItemOffsets(
        outRect: Rect,
        view: View,
        parent: RecyclerView,
        state: RecyclerView.State
    ) {
        outRect.bottom = space
    }
}

recyclerView.addItemDecoration(VerticalSpaceItemDecoration(16))
```

### Item Animator

```kotlin
recyclerView.itemAnimator = DefaultItemAnimator()
```

### Disable Nested Scrolling

```xml
android:nestedScrollingEnabled="false"
```

### Header and Footer

Use `ConcatAdapter` (formerly MergeAdapter):

```kotlin
val headerAdapter = HeaderAdapter()
val contentAdapter = ContentAdapter()
val footerAdapter = FooterAdapter()

recyclerView.adapter = ConcatAdapter(headerAdapter, contentAdapter, footerAdapter)
```

## AppBar and Toolbar

Use Toolbar instead of ActionBar for better compatibility and flexibility.

### Setup

```xml
<com.google.android.material.appbar.AppBarLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <com.google.android.material.appbar.MaterialToolbar
        android:id="@+id/toolbar"
        android:layout_width="match_parent"
        android:layout_height="?attr/actionBarSize"
        app:title="My App"/>
</com.google.android.material.appbar.AppBarLayout>
```

```kotlin
setSupportActionBar(binding.toolbar)
```

### Navigation Drawer

```xml
<com.google.android.material.navigation.NavigationView
    android:id="@+id/nav_view"
    android:layout_width="wrap_content"
    android:layout_height="match_parent"
    android:layout_gravity="start"
    android:fitsSystemWindows="true"
    app:headerLayout="@layout/nav_header"
    app:menu="@menu/drawer_menu"/>
```

```kotlin
navigationView.setNavigationItemSelectedListener { menuItem ->
    when (menuItem.itemId) {
        R.id.nav_home -> {
            // Handle home
        }
        R.id.nav_settings -> {
            startActivity(Intent(this, SettingsActivity::class.java))
        }
    }
    menuItem.isChecked = true
    drawerLayout.closeDrawers()
    true
}
```

### SearchView

Reference: [Action Views Documentation](https://developer.android.com/training/appbar/action-views)

### Tabs

Reference: [Lateral Navigation Documentation](https://developer.android.com/training/implementing-navigation/lateral)

## ViewPager with TabLayout

### Setup

```xml
<com.google.android.material.tabs.TabLayout
    android:id="@+id/tabLayout"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"/>

<androidx.viewpager2.widget.ViewPager2
    android:id="@+id/viewPager"
    android:layout_width="match_parent"
    android:layout_height="0dp"
    android:layout_weight="1"/>
```

### Tab Styling

```xml
<style name="TabLayoutStyle" parent="Widget.Design.TabLayout">
    <item name="tabIndicatorColor">@color/primary</item>
    <item name="tabIndicatorHeight">3dp</item>
    <item name="tabSelectedTextColor">@color/primary</item>
    <item name="tabTextAppearance">@style/TabTextAppearance</item>
</style>
```

### Connecting with ViewPager

```kotlin
TabLayoutMediator(tabLayout, viewPager) { tab, position ->
    tab.text = titles[position]
}.attach()
```

### Custom Tab Views

```kotlin
for (i in 0 until tabLayout.tabCount) {
    val tab = tabLayout.getTabAt(i)
    tab?.setCustomView(R.layout.custom_tab)
}
```

### FragmentStateAdapter

```kotlin
class ViewPagerAdapter(fragmentActivity: FragmentActivity) : FragmentStateAdapter(fragmentActivity) {

    private val fragments = mutableListOf<Fragment>()
    private val titles = mutableListOf<String>()

    fun addFragment(title: String, fragment: Fragment) {
        fragments.add(fragment)
        titles.add(title)
    }

    override fun getItemCount(): Int = fragments.size

    override fun createFragment(position: Int): Fragment = fragments[position]

    fun getTitle(position: Int): String = titles[position]
}
```

## EditText and TextInputLayout

### TextInputLayout

```xml
<com.google.android.material.textfield.TextInputLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:hint="Email">

    <com.google.android.material.textfield.TextInputEditText
        android:layout_width="match_parent"
        android:layout_height="wrap_content"/>
</com.google.android.material.textfield.TextInputLayout>
```

### Restrict Input Characters

```xml
<!-- Only allow specific characters -->
<EditText
    android:digits="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"/>
```

```kotlin
// Programmatically
editText.keyListener = DigitsKeyListener.getInstance("0123456789")
```

## ViewStub

ViewStub provides lazy inflation for views that aren't always needed.

### XML Definition

```xml
<ViewStub
    android:id="@+id/stub"
    android:inflatedId="@+id/inflatedView"
    android:layout="@layout/my_layout"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"/>
```

### Inflating

```kotlin
val stub: ViewStub = findViewById(R.id.stub)
val inflatedView: View = stub.inflate()
```

### Use Cases

- Error views that only appear occasionally
- Network connection lost indicators
- Optional content sections

## Navigation Drawer

### Layout Structure

```xml
<androidx.drawerlayout.widget.DrawerLayout
    android:id="@+id/drawerLayout"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <!-- Main content -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical">
        <!-- Your content here -->
    </LinearLayout>

    <!-- Navigation drawer -->
    <com.google.android.material.navigation.NavigationView
        android:id="@+id/navigationView"
        android:layout_width="wrap_content"
        android:layout_height="match_parent"
        android:layout_gravity="start"
        app:headerLayout="@layout/nav_header"
        app:menu="@menu/nav_menu"/>
</androidx.drawerlayout.widget.DrawerLayout>
```

### Handling Navigation

```kotlin
navigationView.setNavigationItemSelectedListener { menuItem ->
    when (menuItem.itemId) {
        R.id.nav_home -> {
            // Already on home
        }
        R.id.nav_profile -> {
            startActivity(Intent(this, ProfileActivity::class.java).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
            })
        }
    }
    menuItem.isChecked = true
    drawerLayout.closeDrawers()
    true
}
```

## Animations

### XML Animation

Create animation file in `res/anim/`:

```xml
<!-- res/anim/rotate_arrow.xml -->
<set xmlns:android="http://schemas.android.com/apk/res/android"
    android:fillAfter="true">

    <rotate
        android:duration="@android:integer/config_shortAnimTime"
        android:fromDegrees="0"
        android:toDegrees="180"
        android:pivotX="50%"
        android:pivotY="50%"
        android:interpolator="@android:interpolator/decelerate_quad"/>
</set>
```

### Loading Animation

```kotlin
val animation = AnimationUtils.loadAnimation(context, R.anim.rotate_arrow)
imageView.startAnimation(animation)
```

### Property Animation (ObjectAnimator)

```kotlin
ObjectAnimator.ofFloat(view, "translationY", 0f, 100f).apply {
    duration = 300
    interpolator = DecelerateInterpolator()
    start()
}
```

### Layout Transition Animation

Enable default animations for layout changes:

```xml
<LinearLayout
    android:animateLayoutChanges="true">
```

### Transition Animation Between Activities

Reference: [Layout Animation Documentation](https://developer.android.com/training/animation/layout)

### Custom Interpolators

Use the [Ceaser tool](https://matthewlein.com/tools/ceaser) for creating custom animation curves.

## Best Practices

### 1. Use ConstraintLayout for Complex Layouts

Reduces view hierarchy depth and improves performance.

### 2. RecyclerView DiffUtil

Use DiffUtil for efficient list updates:

```kotlin
class MyDiffCallback(
    private val oldList: List<Item>,
    private val newList: List<Item>
) : DiffUtil.Callback() {
    override fun getOldListSize() = oldList.size
    override fun getNewListSize() = newList.size
    override fun areItemsTheSame(oldPos: Int, newPos: Int) =
        oldList[oldPos].id == newList[newPos].id
    override fun areContentsTheSame(oldPos: Int, newPos: Int) =
        oldList[oldPos] == newList[newPos]
}
```

### 3. ViewBinding

Use ViewBinding instead of findViewById:

```kotlin
private lateinit var binding: ActivityMainBinding

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    binding = ActivityMainBinding.inflate(layoutInflater)
    setContentView(binding.root)
}
```

### 4. Avoid Deep View Hierarchies

- Use ConstraintLayout to flatten hierarchies
- Use `<merge>` tag for included layouts
- Profile with Layout Inspector

## References

- [ConstraintLayout Documentation](https://developer.android.com/reference/androidx/constraintlayout/widget/ConstraintLayout)
- [CoordinatorLayout Guide](https://www.androidauthority.com/using-coordinatorlayout-android-apps-703720/)
- [RecyclerView Advanced Animations](https://hackmd.io/s/r1IEQ-jAl)
- [Navigation Drawer](https://developer.android.com/training/implementing-navigation/nav-drawer)
