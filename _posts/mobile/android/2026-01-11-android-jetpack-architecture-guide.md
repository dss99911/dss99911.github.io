---
layout: post
title: "Android Jetpack Architecture Components - ViewModel, LiveData, and Room"
date: 2026-01-11
categories: [mobile, android]
tags: [android, kotlin, jetpack, mvvm, livedata, viewmodel, room]
---

Android Jetpack Architecture Components provide a robust framework for building Android apps with clean architecture patterns. This guide covers the essential components: ViewModel, LiveData, and Room, along with best practices for implementing MVVM architecture.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [ViewModel](#viewmodel)
3. [LiveData](#livedata)
4. [Transformations](#transformations)
5. [MediatorLiveData](#mediatorlivedata)
6. [Room Database](#room-database)
7. [Best Practices](#best-practices)

## Architecture Overview

Android Architecture Components help you design robust, testable, and maintainable apps.

### Choosing Architecture Pattern

| Pattern | Use Case |
|---------|----------|
| MVVM | Simple UI logic, data-driven UIs |
| MVP | Complex UI logic, heavy user interactions |
| Mixed | Combine based on app needs |

### Key Considerations

- **Screen Rotation**: Activity instances are recreated on configuration changes
- **Lifecycle Awareness**: `onCreate` can be called without `onDestroy` being called first
- **Memory Leaks**: Data layers should not hold strong references to ViewModels or Views

### Handling Single Events

There are several approaches to handle one-time events:

1. **Event Wrapper Class**
   - Wrap data with an event class that tracks consumption
   - Downside: Adds unnecessary fields for data that doesn't need persistence

2. **WeakReference to View**
   - Simple approach
   - ViewModel holds a WeakReference to the View

3. **SingleLiveEvent**
   - Custom LiveData that only delivers events once

```kotlin
// Event wrapper example
open class Event<out T>(private val content: T) {
    var hasBeenHandled = false
        private set

    fun getContentIfNotHandled(): T? {
        return if (hasBeenHandled) {
            null
        } else {
            hasBeenHandled = true
            content
        }
    }
}
```

### Preventing Memory Leaks

When data layer needs to communicate with ViewModel:

- Use **WeakReference** for callbacks
- Clear references in **ViewModel.onCleared()**
- Use **LiveData** with **Transformations**

## ViewModel

ViewModel stores and manages UI-related data in a lifecycle-conscious way, surviving configuration changes.

### Basic Usage

```kotlin
class MyViewModel : ViewModel() {
    private val _users = MutableLiveData<List<User>>()
    val users: LiveData<List<User>> = _users

    fun loadUsers() {
        // Load users from repository
    }
}
```

### Getting ViewModel Instance

```kotlin
// In Activity or Fragment
val viewModel = ViewModelProvider(this).get(MyViewModel::class.java)

// With ViewModelFactory
val viewModel = ViewModelProvider(this, factory).get(MyViewModel::class.java)

// Using Kotlin extensions
val viewModel: MyViewModel by viewModels()
```

### Sharing Data Between Fragments

Fragments can share a ViewModel by scoping it to their Activity:

```kotlin
// In Fragment
val sharedViewModel: SharedViewModel by activityViewModels()

// Or using ViewModelProvider
val model = ViewModelProvider(requireActivity()).get(SharedViewModel::class.java)
```

### ViewModel Benefits

1. **Survives Configuration Changes**: Data persists through screen rotation
2. **Lifecycle Aware**: Automatically cleaned up when Activity/Fragment is destroyed
3. **Data Sharing**: Easy data sharing between Fragments
4. **Separation of Concerns**: Keeps UI logic separate from data logic

## LiveData

LiveData is an observable data holder class that is lifecycle-aware.

### Key Characteristics

- **Lifecycle Aware**: Only notifies active observers
- **No Memory Leaks**: Observers are automatically removed when lifecycle is destroyed
- **Always Up-to-Date**: UI always receives the latest data

### Observer States

| State | Description |
|-------|-------------|
| Active | Observer is in RESUMED or STARTED state |
| Inactive | Observer is in DESTROYED state |

### LiveData States

| State | Condition |
|-------|-----------|
| Active | Has at least one active observer |
| Inactive | Has no active observers |

### setValue vs postValue

```kotlin
class MyViewModel : ViewModel() {
    private val _data = MutableLiveData<String>()

    fun updateFromMainThread() {
        // Must be called from main thread
        _data.value = "New Value"
    }

    fun updateFromBackground() {
        // Can be called from any thread
        _data.postValue("New Value")
    }
}
```

### Observing LiveData

```kotlin
viewModel.users.observe(viewLifecycleOwner) { users ->
    // Update UI
}
```

### With Data Binding

```kotlin
// Set lifecycle owner for LiveData to work with data binding
binding.lifecycleOwner = viewLifecycleOwner
binding.viewModel = viewModel
```

### Custom LiveData

Create a LiveData that wraps a data source:

```kotlin
class StockLiveData(symbol: String) : LiveData<BigDecimal>() {
    private val stockManager = StockManager(symbol)

    private val listener = { price: BigDecimal ->
        value = price
    }

    override fun onActive() {
        // Start receiving updates when there are active observers
        stockManager.requestPriceUpdates(listener)
    }

    override fun onInactive() {
        // Stop receiving updates when there are no active observers
        stockManager.removeUpdates(listener)
    }
}
```

## Transformations

Transformations allow you to apply functions to LiveData values.

### map

Transform the value of LiveData:

```kotlin
val userLiveData: LiveData<User> = UserLiveData()

val userName: LiveData<String> = Transformations.map(userLiveData) { user ->
    "${user.name} ${user.lastName}"
}

// Or using extension function
val userName: LiveData<String> = userLiveData.map { user ->
    "${user.name} ${user.lastName}"
}
```

### switchMap

Replace LiveData based on a trigger:

```kotlin
private fun getUser(id: String): LiveData<User> {
    return repository.getUser(id)
}

val userId: MutableLiveData<String> = MutableLiveData()

val user: LiveData<User> = Transformations.switchMap(userId) { id ->
    getUser(id)
}

// Or using extension function
val user: LiveData<User> = userId.switchMap { id ->
    getUser(id)
}
```

### Key Difference

| Method | Behavior |
|--------|----------|
| `map` | Transforms the value, same LiveData instance |
| `switchMap` | Replaces the LiveData instance entirely |

## MediatorLiveData

MediatorLiveData can observe multiple LiveData sources.

### Basic Usage

```kotlin
val liveData1: LiveData<String> = ...
val liveData2: LiveData<String> = ...

val result = MediatorLiveData<String>()

result.addSource(liveData1) { value ->
    result.value = value
}

result.addSource(liveData2) { value ->
    result.value = value
}
```

### observeForever vs addSource

| Method | Behavior |
|--------|----------|
| `observeForever` | Makes LiveData active immediately |
| `addSource` | Only activates when MediatorLiveData has observers |

**Important**: Use `addSource` for chaining LiveData to avoid unnecessary processing when there are no observers.

```kotlin
// For chaining, use MediatorLiveData.addSource
val combinedData = MediatorLiveData<CombinedResult>()

combinedData.addSource(sourceA) { a ->
    combinedData.value = combine(a, sourceB.value)
}

combinedData.addSource(sourceB) { b ->
    combinedData.value = combine(sourceA.value, b)
}
```

## Room Database

Room provides an abstraction layer over SQLite for robust database access.

### Setup

```groovy
dependencies {
    implementation "androidx.room:room-runtime:2.5.0"
    implementation "androidx.room:room-ktx:2.5.0"
    kapt "androidx.room:room-compiler:2.5.0"
}
```

### Entity

```kotlin
@Entity(tableName = "users")
data class User(
    @PrimaryKey val id: Int,
    @ColumnInfo(name = "first_name") val firstName: String,
    @ColumnInfo(name = "last_name") val lastName: String
)
```

### DAO

```kotlin
@Dao
interface UserDao {
    @Query("SELECT * FROM users")
    fun getAll(): LiveData<List<User>>

    @Query("SELECT * FROM users WHERE id = :userId")
    suspend fun getById(userId: Int): User?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(user: User)

    @Delete
    suspend fun delete(user: User)
}
```

### Database

```kotlin
@Database(entities = [User::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "app_database"
                ).build().also { INSTANCE = it }
            }
        }
    }
}
```

### Type Converters

```kotlin
class Converters {
    @TypeConverter
    fun fromTimestamp(value: Long?): Date? {
        return value?.let { Date(it) }
    }

    @TypeConverter
    fun dateToTimestamp(date: Date?): Long? {
        return date?.time
    }
}

@Database(entities = [User::class], version = 1)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase()
```

### Relationships and Joins

For complex queries with joins, refer to the [Android Persistence Codelab](https://codelabs.developers.google.com/codelabs/android-persistence).

## Best Practices

### 1. Architecture Layer Structure

```
View (Activity/Fragment)
    ↓ observes
ViewModel
    ↓ uses
Repository
    ↓ accesses
Data Sources (Room, Network, etc.)
```

### 2. Single Source of Truth

Repository should be the single source of truth for data:

```kotlin
class UserRepository(
    private val userDao: UserDao,
    private val userApi: UserApi
) {
    val users: LiveData<List<User>> = userDao.getAll()

    suspend fun refresh() {
        val users = userApi.getUsers()
        userDao.insertAll(users)
    }
}
```

### 3. Expose Immutable LiveData

```kotlin
class MyViewModel : ViewModel() {
    private val _data = MutableLiveData<String>()
    val data: LiveData<String> = _data  // Expose as immutable

    fun updateData(newValue: String) {
        _data.value = newValue
    }
}
```

### 4. Use viewModelScope for Coroutines

```kotlin
class MyViewModel : ViewModel() {
    fun loadData() {
        viewModelScope.launch {
            val result = repository.getData()
            _data.value = result
        }
    }
}
```

### 5. Handle Configuration Changes Properly

ViewModel survives configuration changes, so:
- Store UI state in ViewModel
- Don't store Views or Context references in ViewModel
- Use SavedStateHandle for process death survival

```kotlin
class MyViewModel(private val savedStateHandle: SavedStateHandle) : ViewModel() {
    val searchQuery: LiveData<String> = savedStateHandle.getLiveData("query")

    fun setSearchQuery(query: String) {
        savedStateHandle["query"] = query
    }
}
```

## Conclusion

Android Jetpack Architecture Components provide a solid foundation for building modern Android apps. By using ViewModel, LiveData, and Room together, you can create apps that are:

- **Lifecycle-aware**: Properly handle configuration changes
- **Testable**: Clear separation of concerns
- **Maintainable**: Clean architecture patterns
- **Robust**: Survive process death and configuration changes

## References

- [Guide to App Architecture](https://developer.android.com/jetpack/docs/guide)
- [ViewModel Overview](https://developer.android.com/topic/libraries/architecture/viewmodel)
- [LiveData Overview](https://developer.android.com/topic/libraries/architecture/livedata)
- [Room Persistence Library](https://developer.android.com/training/data-storage/room)
- [ViewModels and LiveData: Patterns + AntiPatterns](https://medium.com/androiddevelopers/viewmodels-and-livedata-patterns-antipatterns-21efaef74a54)
