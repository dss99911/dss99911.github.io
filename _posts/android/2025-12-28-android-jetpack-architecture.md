---
layout: post
title: "Android Jetpack Architecture Components 가이드"
date: 2025-12-28 12:02:00 +0900
categories: android
tags: [android, jetpack, livedata, viewmodel, room, lifecycle]
description: "Android Jetpack Architecture Components인 ViewModel, LiveData, Room, Lifecycle 등의 사용법과 베스트 프랙티스를 알아봅니다."
---

# Android Jetpack Architecture Components 가이드

Android Jetpack Architecture Components는 견고하고 테스트 가능한 앱을 쉽게 만들 수 있도록 도와주는 라이브러리 모음입니다.

## ViewModel

ViewModel은 UI 관련 데이터를 저장하고 관리하며, 화면 회전과 같은 구성 변경에서도 데이터를 유지합니다.

### 기본 사용법

```kotlin
class MyViewModel : ViewModel() {
    private val _userData = MutableLiveData<User>()
    val userData: LiveData<User> = _userData

    fun loadUser(userId: String) {
        // 데이터 로드 로직
    }
}
```

### Activity/Fragment에서 ViewModel 가져오기

```kotlin
// Activity에서
val viewModel: MyViewModel by viewModels()

// Fragment에서 Activity의 ViewModel 공유
val sharedViewModel: SharedViewModel by activityViewModels()
```

### Fragment 간 데이터 공유

```kotlin
// Fragment A와 B가 같은 Activity의 ViewModel을 공유
class FragmentA : Fragment() {
    private val sharedViewModel: SharedViewModel by activityViewModels()
}

class FragmentB : Fragment() {
    private val sharedViewModel: SharedViewModel by activityViewModels()
}
```

### ViewModel의 장점

- Activity lifecycle을 따르며, 상태 변경에 영향받지 않음
- Fragment 간 데이터 공유 용이
- 비즈니스 로직과 UI 분리

## LiveData

LiveData는 lifecycle을 인식하는 observable 데이터 홀더 클래스입니다.

### 기본 사용법

```kotlin
class MyViewModel : ViewModel() {
    private val _name = MutableLiveData<String>()
    val name: LiveData<String> = _name

    fun updateName(newName: String) {
        _name.value = newName  // Main thread
        // 또는
        _name.postValue(newName)  // Background thread
    }
}
```

### Observer 등록

```kotlin
viewModel.name.observe(viewLifecycleOwner) { name ->
    textView.text = name
}
```

### Transformations

```kotlin
val userLiveData: LiveData<User> = repository.getUser()

// map 변환
val userName: LiveData<String> = userLiveData.map { user ->
    "${user.firstName} ${user.lastName}"
}

// switchMap 변환 (새 LiveData 반환)
val userId = MutableLiveData<String>()
val user: LiveData<User> = userId.switchMap { id ->
    repository.getUser(id)
}
```

### MediatorLiveData

여러 LiveData 소스를 결합할 때 사용합니다.

```kotlin
val mediatorLiveData = MediatorLiveData<String>()

mediatorLiveData.addSource(liveData1) { value ->
    mediatorLiveData.value = "Source1: $value"
}

mediatorLiveData.addSource(liveData2) { value ->
    mediatorLiveData.value = "Source2: $value"
}
```

### observeForever vs addSource 차이

- `observeForever`: LiveData의 상태를 active로 만들어 즉시 동작 시작
- `addSource`: MediatorLiveData가 observe되지 않으면 동작하지 않음
- 체인을 걸 때는 MediatorLiveData 사용 권장

### Lifecycle 상태 체크

```kotlin
if (lifecycle.currentState.isAtLeast(Lifecycle.State.RESUMED)) {
    // Resume 상태일 때만 실행
}
```

## Room Database

Room은 SQLite 위에 추상화 레이어를 제공하는 ORM 라이브러리입니다.

### 의존성 추가

```kotlin
dependencies {
    implementation "androidx.room:room-runtime:2.6.1"
    kapt "androidx.room:room-compiler:2.6.1"
    implementation "androidx.room:room-ktx:2.6.1"
}
```

### Entity 정의

```kotlin
@Entity(tableName = "users")
data class User(
    @PrimaryKey val id: Int,
    @ColumnInfo(name = "first_name") val firstName: String,
    @ColumnInfo(name = "last_name") val lastName: String
)
```

### DAO 정의

```kotlin
@Dao
interface UserDao {
    @Query("SELECT * FROM users")
    fun getAll(): Flow<List<User>>

    @Query("SELECT * FROM users WHERE id = :userId")
    suspend fun getById(userId: Int): User?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(user: User)

    @Delete
    suspend fun delete(user: User)
}
```

### Database 클래스

```kotlin
@Database(entities = [User::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "app_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
```

## Lifecycle

LifecycleObserver를 통해 lifecycle 이벤트에 반응하는 컴포넌트를 만들 수 있습니다.

### LifecycleObserver 구현

```kotlin
class MyObserver : DefaultLifecycleObserver {
    override fun onResume(owner: LifecycleOwner) {
        // Resume 시 실행
    }

    override fun onPause(owner: LifecycleOwner) {
        // Pause 시 실행
    }
}

// 등록
lifecycle.addObserver(MyObserver())
```

### Application Lifecycle 관찰

```kotlin
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        ProcessLifecycleOwner.get().lifecycle.addObserver(
            object : DefaultLifecycleObserver {
                override fun onStart(owner: LifecycleOwner) {
                    // 앱이 포그라운드로 왔을 때
                }

                override fun onStop(owner: LifecycleOwner) {
                    // 앱이 백그라운드로 갔을 때
                }
            }
        )
    }
}
```

### Activity Lifecycle Callbacks

```kotlin
registerActivityLifecycleCallbacks(object : ActivityLifecycleCallbacks {
    private var activityCount = 0

    override fun onActivityStarted(activity: Activity) {
        activityCount++
    }

    override fun onActivityStopped(activity: Activity) {
        activityCount--
        if (activityCount == 0) {
            // 모든 Activity가 종료됨
        }
    }
    // 나머지 콜백 구현...
})
```

## Paging

대용량 데이터를 효율적으로 로드하기 위한 라이브러리입니다.

### 기본 구조

```kotlin
// DataSource
class UserDataSource : PagingSource<Int, User>() {
    override suspend fun load(params: LoadParams<Int>): LoadResult<Int, User> {
        val page = params.key ?: 1
        return try {
            val users = api.getUsers(page, params.loadSize)
            LoadResult.Page(
                data = users,
                prevKey = if (page == 1) null else page - 1,
                nextKey = if (users.isEmpty()) null else page + 1
            )
        } catch (e: Exception) {
            LoadResult.Error(e)
        }
    }
}
```

### ViewModel에서 사용

```kotlin
class UserViewModel : ViewModel() {
    val users: Flow<PagingData<User>> = Pager(
        config = PagingConfig(pageSize = 20)
    ) {
        UserDataSource()
    }.flow.cachedIn(viewModelScope)
}
```

### RecyclerView에 연결

```kotlin
class UserAdapter : PagingDataAdapter<User, UserViewHolder>(UserDiffCallback()) {
    // 구현
}

// Fragment/Activity에서
lifecycleScope.launch {
    viewModel.users.collectLatest { pagingData ->
        adapter.submitData(pagingData)
    }
}
```

## 테스트

### ViewModel 테스트

```kotlin
@Test
fun `test user loading`() = runTest {
    val viewModel = MyViewModel(mockRepository)

    viewModel.loadUser("123")

    assertEquals("Expected Name", viewModel.userData.value?.name)
}
```

### LiveData 테스트

```kotlin
@get:Rule
val instantTaskExecutorRule = InstantTaskExecutorRule()

@Test
fun `test livedata update`() {
    val viewModel = MyViewModel()

    viewModel.updateName("Test")

    assertEquals("Test", viewModel.name.value)
}
```

## 결론

Jetpack Architecture Components를 활용하면 lifecycle을 고려한 안정적인 앱을 개발할 수 있습니다. ViewModel로 UI 데이터를 관리하고, LiveData로 반응형 UI를 구현하며, Room으로 로컬 데이터를 효율적으로 저장하세요.
