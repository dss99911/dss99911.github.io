---
layout: post
title: "Android 개발 방법론 - MVVM 아키텍처와 TDD 기반 개발 가이드"
date: 2026-01-11
categories: [programming, android]
tags: [android, mvvm, tdd, kotlin, clean-architecture, jetpack]
image: /assets/images/posts/android-development-methodology.png
---

현대적인 Android 앱 개발 방법론에 대해 알아봅니다. MVVM 아키텍처를 기반으로 한 계층별 개발 순서, TDD 적용 방법, 그리고 실무에서 바로 사용할 수 있는 개발 팁을 제공합니다.

## 개발 과정 개요

Android 앱 개발은 크게 4개 레이어로 나누어 순차적으로 진행합니다.

```
API Layer -> Database Layer -> ViewModel Layer -> UI Layer
    |              |                |               |
    v              v                v               v
   설계 -> 코드 정의 -> 테스트 작성 -> 구현 -> 테스팅
```

## 1. API Layer 개발

### 1.1 API 설계

서버와의 통신을 위한 Request/Response를 먼저 설계합니다.

```kotlin
// Request 모델
data class LoginRequest(
    val email: String,
    val password: String
)

// Response 모델
data class LoginResponse(
    val userId: Long,
    val accessToken: String,
    val refreshToken: String,
    val expiresIn: Long
)

// API 인터페이스 정의
interface AuthApi {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @POST("auth/refresh")
    suspend fun refreshToken(@Body refreshToken: String): Response<LoginResponse>
}
```

### 1.2 데이터베이스 설계

앱 내 저장이 필요한 데이터의 테이블 구조를 설계합니다.

```kotlin
// Entity 정의
@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey
    val id: Long,
    val email: String,
    val name: String,
    val avatarUrl: String?,
    val createdAt: Long
)

// Response를 Entity로 변환
fun UserResponse.toEntity(): UserEntity {
    return UserEntity(
        id = this.id,
        email = this.email,
        name = this.name,
        avatarUrl = this.avatar,
        createdAt = System.currentTimeMillis()
    )
}
```

### 1.3 POC (Proof of Concept)

실현 가능한지 검증합니다.

```kotlin
// 간단한 POC 테스트
class ApiPocTest {
    @Test
    fun `verify API endpoint is accessible`() = runTest {
        val api = Retrofit.Builder()
            .baseUrl("https://api.example.com/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(AuthApi::class.java)

        val response = api.login(LoginRequest("test@test.com", "test"))
        assertTrue(response.isSuccessful)
    }
}
```

### 1.4 API Unit Test 작성

정의된 JSON으로 Mock 데이터를 만들고 파싱 테스트를 합니다.

```kotlin
class LoginResponseParsingTest {

    private val gson = Gson()

    @Test
    fun `should parse login response correctly`() {
        // Given: Mock JSON
        val mockJson = """
            {
                "userId": 12345,
                "accessToken": "eyJhbGciOiJIUzI1NiIs...",
                "refreshToken": "dGhpcyBpcyByZWZyZXNo...",
                "expiresIn": 3600
            }
        """.trimIndent()

        // When: 파싱
        val response = gson.fromJson(mockJson, LoginResponse::class.java)

        // Then: 검증
        assertEquals(12345L, response.userId)
        assertEquals("eyJhbGciOiJIUzI1NiIs...", response.accessToken)
        assertEquals(3600L, response.expiresIn)
    }

    @Test
    fun `should handle null fields gracefully`() {
        val mockJson = """
            {
                "userId": 12345,
                "accessToken": "token",
                "refreshToken": null,
                "expiresIn": 3600
            }
        """.trimIndent()

        val response = gson.fromJson(mockJson, LoginResponse::class.java)
        assertNull(response.refreshToken)
    }
}
```

### 1.5 API 구현 및 테스팅

```kotlin
class AuthRepositoryImpl @Inject constructor(
    private val api: AuthApi,
    private val tokenStorage: TokenStorage
) : AuthRepository {

    override suspend fun login(email: String, password: String): Result<User> {
        return try {
            val response = api.login(LoginRequest(email, password))
            if (response.isSuccessful) {
                val body = response.body()!!
                tokenStorage.saveTokens(body.accessToken, body.refreshToken)
                Result.success(User(body.userId))
            } else {
                Result.failure(ApiException(response.code(), response.message()))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
```

## 2. Database Layer 개발

### 2.1 Room 데이터 모델 정의

```kotlin
@Entity(tableName = "orders")
data class OrderEntity(
    @PrimaryKey
    val id: Long,
    val userId: Long,
    val totalAmount: Double,
    val status: String,
    @ColumnInfo(name = "created_at")
    val createdAt: Long
)

@Dao
interface OrderDao {
    @Query("SELECT * FROM orders WHERE userId = :userId ORDER BY created_at DESC")
    fun getOrdersByUser(userId: Long): Flow<List<OrderEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrders(orders: List<OrderEntity>)

    @Query("DELETE FROM orders WHERE id = :orderId")
    suspend fun deleteOrder(orderId: Long)
}
```

### 2.2 Room Unit Test 구현

```kotlin
@RunWith(AndroidJUnit4::class)
class OrderDaoTest {

    private lateinit var database: AppDatabase
    private lateinit var orderDao: OrderDao

    @Before
    fun setup() {
        database = Room.inMemoryDatabaseBuilder(
            ApplicationProvider.getApplicationContext(),
            AppDatabase::class.java
        ).allowMainThreadQueries().build()
        orderDao = database.orderDao()
    }

    @After
    fun teardown() {
        database.close()
    }

    @Test
    fun `insert and retrieve orders`() = runTest {
        // Given
        val orders = listOf(
            OrderEntity(1, 100, 50000.0, "COMPLETED", System.currentTimeMillis()),
            OrderEntity(2, 100, 30000.0, "PENDING", System.currentTimeMillis())
        )

        // When
        orderDao.insertOrders(orders)
        val retrieved = orderDao.getOrdersByUser(100).first()

        // Then
        assertEquals(2, retrieved.size)
        assertEquals(50000.0, retrieved[0].totalAmount, 0.01)
    }
}
```

## 3. ViewModel Layer 개발

### 3.1 ViewModel 인터페이스 정의

UI 데이터 및 이벤트 메서드를 정의합니다.

```kotlin
class OrderViewModel @Inject constructor(
    private val orderRepository: OrderRepository,
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {

    // UI State
    private val _uiState = MutableStateFlow(OrderUiState())
    val uiState: StateFlow<OrderUiState> = _uiState.asStateFlow()

    // Events
    private val _events = Channel<OrderEvent>()
    val events = _events.receiveAsFlow()

    // Actions
    fun loadOrders() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            orderRepository.getOrders()
                .onSuccess { orders ->
                    _uiState.update {
                        it.copy(isLoading = false, orders = orders)
                    }
                }
                .onFailure { error ->
                    _uiState.update {
                        it.copy(isLoading = false, error = error.message)
                    }
                }
        }
    }

    fun cancelOrder(orderId: Long) {
        viewModelScope.launch {
            orderRepository.cancelOrder(orderId)
                .onSuccess {
                    _events.send(OrderEvent.OrderCancelled)
                    loadOrders()
                }
                .onFailure { error ->
                    _events.send(OrderEvent.Error(error.message ?: "Unknown error"))
                }
        }
    }
}

data class OrderUiState(
    val isLoading: Boolean = false,
    val orders: List<Order> = emptyList(),
    val error: String? = null
)

sealed class OrderEvent {
    object OrderCancelled : OrderEvent()
    data class Error(val message: String) : OrderEvent()
}
```

### 3.2 ViewModel Unit Test 구현

기획서에 정의된 모든 케이스를 테스팅합니다.

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
class OrderViewModelTest {

    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()

    private lateinit var viewModel: OrderViewModel
    private lateinit var mockRepository: MockOrderRepository

    @Before
    fun setup() {
        mockRepository = MockOrderRepository()
        viewModel = OrderViewModel(mockRepository, SavedStateHandle())
    }

    @Test
    fun `loadOrders success updates uiState with orders`() = runTest {
        // Given
        val expectedOrders = listOf(
            Order(1, 50000.0, OrderStatus.COMPLETED),
            Order(2, 30000.0, OrderStatus.PENDING)
        )
        mockRepository.setOrders(expectedOrders)

        // When
        viewModel.loadOrders()
        advanceUntilIdle()

        // Then
        val state = viewModel.uiState.value
        assertFalse(state.isLoading)
        assertEquals(2, state.orders.size)
        assertNull(state.error)
    }

    @Test
    fun `loadOrders failure updates uiState with error`() = runTest {
        // Given
        mockRepository.setShouldFail(true)

        // When
        viewModel.loadOrders()
        advanceUntilIdle()

        // Then
        val state = viewModel.uiState.value
        assertFalse(state.isLoading)
        assertTrue(state.orders.isEmpty())
        assertNotNull(state.error)
    }

    @Test
    fun `cancelOrder success emits OrderCancelled event`() = runTest {
        // Given
        val events = mutableListOf<OrderEvent>()
        val job = launch { viewModel.events.toList(events) }

        // When
        viewModel.cancelOrder(1)
        advanceUntilIdle()

        // Then
        assertTrue(events.any { it is OrderEvent.OrderCancelled })
        job.cancel()
    }
}
```

## 4. UI Layer 개발

### 4.1 UI 컴포넌트 정의

```kotlin
@Composable
fun OrderListScreen(
    viewModel: OrderViewModel = hiltViewModel(),
    onOrderClick: (Long) -> Unit
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    LaunchedEffect(Unit) {
        viewModel.loadOrders()
    }

    // Event 처리
    LaunchedEffect(Unit) {
        viewModel.events.collect { event ->
            when (event) {
                is OrderEvent.OrderCancelled -> {
                    // Show snackbar
                }
                is OrderEvent.Error -> {
                    // Show error dialog
                }
            }
        }
    }

    OrderListContent(
        uiState = uiState,
        onOrderClick = onOrderClick,
        onCancelClick = viewModel::cancelOrder,
        onRetry = viewModel::loadOrders
    )
}

@Composable
private fun OrderListContent(
    uiState: OrderUiState,
    onOrderClick: (Long) -> Unit,
    onCancelClick: (Long) -> Unit,
    onRetry: () -> Unit
) {
    Box(modifier = Modifier.fillMaxSize()) {
        when {
            uiState.isLoading -> {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.Center)
                )
            }
            uiState.error != null -> {
                ErrorView(
                    message = uiState.error,
                    onRetry = onRetry,
                    modifier = Modifier.align(Alignment.Center)
                )
            }
            uiState.orders.isEmpty() -> {
                EmptyView(
                    message = "No orders yet",
                    modifier = Modifier.align(Alignment.Center)
                )
            }
            else -> {
                LazyColumn {
                    items(uiState.orders) { order ->
                        OrderItem(
                            order = order,
                            onClick = { onOrderClick(order.id) },
                            onCancelClick = { onCancelClick(order.id) }
                        )
                    }
                }
            }
        }
    }
}
```

### 4.2 UI Unit Test

각 케이스별 UI가 정상적으로 보이는지 스크린샷으로 확인합니다.

```kotlin
class OrderListScreenTest {

    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun `when loading, show progress indicator`() {
        composeTestRule.setContent {
            OrderListContent(
                uiState = OrderUiState(isLoading = true),
                onOrderClick = {},
                onCancelClick = {},
                onRetry = {}
            )
        }

        composeTestRule.onNodeWithTag("loading_indicator").assertIsDisplayed()
    }

    @Test
    fun `when orders exist, display order list`() {
        val orders = listOf(
            Order(1, 50000.0, OrderStatus.COMPLETED),
            Order(2, 30000.0, OrderStatus.PENDING)
        )

        composeTestRule.setContent {
            OrderListContent(
                uiState = OrderUiState(orders = orders),
                onOrderClick = {},
                onCancelClick = {},
                onRetry = {}
            )
        }

        composeTestRule.onNodeWithText("50,000").assertIsDisplayed()
        composeTestRule.onNodeWithText("30,000").assertIsDisplayed()
    }

    @Test
    fun `when order clicked, callback is invoked`() {
        var clickedOrderId: Long? = null
        val orders = listOf(Order(1, 50000.0, OrderStatus.COMPLETED))

        composeTestRule.setContent {
            OrderListContent(
                uiState = OrderUiState(orders = orders),
                onOrderClick = { clickedOrderId = it },
                onCancelClick = {},
                onRetry = {}
            )
        }

        composeTestRule.onNodeWithText("50,000").performClick()
        assertEquals(1L, clickedOrderId)
    }
}
```

## 개발 팁

### 1. 자신만의 TODO 코멘트 활용

빠진 부분이 없는지 체크할 수 있는 커스텀 TODO를 만듭니다.

```kotlin
// 개인 TODO 태그 정의
// TODO(hyun): 에러 핸들링 추가
// FIXME(hyun): 메모리 릭 확인 필요
// OPTIMIZE(hyun): 성능 개선 필요

// Android Studio에서 필터링 가능
```

### 2. Instant Run 활용

개발 중 빠른 빌드를 위해 Apply Changes를 활용합니다.

```
Apply Changes and Restart Activity: Ctrl+F10 (Cmd+F10)
Apply Code Changes: Ctrl+Shift+F10 (Cmd+Shift+F10)
```

### 3. 가상 디바이스 테스트

```kotlin
// 다양한 화면 크기 테스트
@Config(qualifiers = "w320dp-h480dp") // 소형 화면
@Config(qualifiers = "w600dp-h800dp") // 태블릿
@Config(qualifiers = "land") // 가로 모드
```

### 4. 테스트 디바이스 최적화

개발을 방해하지 않는 테스트 환경 구성:
- 개발자 옵션에서 "USB 디버깅 인증" 항상 허용
- 화면 꺼짐 방지 설정
- USB 연결 안정성 확인

### 5. UI 레이아웃 가이드

```xml
<!-- ConstraintLayout 베스트 프랙티스 -->
<androidx.constraintlayout.widget.ConstraintLayout>

    <!-- 1. 먼저 Guideline 정의 -->
    <androidx.constraintlayout.widget.Guideline
        android:id="@+id/guideline_start"
        android:orientation="vertical"
        app:layout_constraintGuide_begin="16dp" />

    <!-- 2. Barrier로 동적 경계 설정 -->
    <androidx.constraintlayout.widget.Barrier
        android:id="@+id/barrier_bottom"
        app:barrierDirection="bottom"
        app:constraint_referenced_ids="title,subtitle" />

    <!-- 3. Group으로 가시성 관리 -->
    <androidx.constraintlayout.widget.Group
        android:id="@+id/loading_group"
        android:visibility="gone"
        app:constraint_referenced_ids="progress,loading_text" />

    <!-- 4. UI 컴포넌트 배치 -->
    <TextView
        android:id="@+id/title"
        app:layout_constraintStart_toEndOf="@id/guideline_start"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

## 정리: 개발 체크리스트

```markdown
## API Layer
- [ ] Request/Response 모델 정의
- [ ] API 인터페이스 정의
- [ ] POC 검증
- [ ] Unit Test 작성
- [ ] API 구현
- [ ] 실제 API 테스트

## Database Layer
- [ ] Entity 정의
- [ ] DAO 정의
- [ ] Unit Test 작성
- [ ] Repository 구현
- [ ] DB 테스트

## ViewModel Layer
- [ ] State 클래스 정의
- [ ] Event 클래스 정의
- [ ] ViewModel 구현
- [ ] Unit Test (기획서 케이스별)
- [ ] ViewModel 테스팅

## UI Layer
- [ ] Composable/Layout 정의
- [ ] Data Binding 연결
- [ ] UI Test 작성
- [ ] Screenshot Test
- [ ] 실제 UI 테스팅
```

## 결론

체계적인 Android 개발은:

1. **계층별 순차 개발**: API -> Database -> ViewModel -> UI
2. **TDD 적용**: 테스트 먼저 작성
3. **명확한 책임 분리**: 각 레이어의 역할 명확히
4. **지속적인 검증**: 각 단계마다 테스트

이러한 접근 방식으로 유지보수가 쉽고 테스트 가능한 앱을 만들 수 있습니다.

---

## 참고 자료

- [Android Architecture Guide](https://developer.android.com/topic/architecture)
- [Jetpack Compose](https://developer.android.com/jetpack/compose)
- [Testing in Android](https://developer.android.com/training/testing)
