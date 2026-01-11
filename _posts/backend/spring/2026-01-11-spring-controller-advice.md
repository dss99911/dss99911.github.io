---
layout: post
title: "Spring ControllerAdvice - 전역 예외 처리와 공통 로직 가이드"
date: 2026-01-11 11:30:00 +0900
categories: [backend, spring]
tags: [spring, controller-advice, exception-handling, rest-api]
description: "Spring의 @ControllerAdvice를 활용한 전역 예외 처리와 공통 로직 관리 방법을 알아봅니다. REST API의 일관된 에러 응답 구현까지 다룹니다."
image: /assets/images/posts/spring-controller-advice.png
---

Spring MVC에서 `@ControllerAdvice`는 모든 컨트롤러에 공통으로 적용되는 로직을 정의할 수 있는 강력한 기능입니다. 전역 예외 처리, 공통 모델 속성 추가, 데이터 바인딩 설정 등에 활용됩니다.

## @ControllerAdvice란?

`@ControllerAdvice`는 `@Controller` 어노테이션이 붙은 모든 클래스에 적용되는 AOP 기반의 어노테이션입니다. 컨트롤러 로직과 횡단 관심사를 분리하여 깔끔한 코드를 유지할 수 있습니다.

### 주요 기능

- **@ExceptionHandler**: 전역 예외 처리
- **@ModelAttribute**: 공통 모델 속성 추가
- **@InitBinder**: 데이터 바인딩 커스터마이징

## 전역 예외 처리

### 기본 구조

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        logger.error("Unhandled exception", e);

        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Internal Server Error",
            e.getMessage()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

### REST API용 (@RestControllerAdvice)

`@RestControllerAdvice`는 `@ControllerAdvice` + `@ResponseBody`입니다:

```java
@RestControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleResourceNotFound(ResourceNotFoundException e) {
        return new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            "Not Found",
            e.getMessage()
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleIllegalArgument(IllegalArgumentException e) {
        return new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Bad Request",
            e.getMessage()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationError(MethodArgumentNotValidException e) {
        List<String> errors = e.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .collect(Collectors.toList());

        return new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Validation Failed",
            String.join(", ", errors)
        );
    }
}
```

### 에러 응답 클래스

```java
@Getter
@AllArgsConstructor
public class ErrorResponse {
    private int status;
    private String error;
    private String message;
    private LocalDateTime timestamp = LocalDateTime.now();

    public ErrorResponse(int status, String error, String message) {
        this.status = status;
        this.error = error;
        this.message = message;
    }
}
```

## 적용 범위 제한

### 특정 패키지만 적용

```java
@ControllerAdvice("com.example.api")
public class ApiExceptionHandler {
    // com.example.api 패키지의 컨트롤러에만 적용
}

@ControllerAdvice(basePackages = {"com.example.web", "com.example.admin"})
public class WebExceptionHandler {
    // 여러 패키지에 적용
}
```

### 특정 클래스에만 적용

```java
@ControllerAdvice(assignableTypes = {UserController.class, OrderController.class})
public class SpecificExceptionHandler {
    // 지정된 컨트롤러에만 적용
}

// 인터페이스/부모 클래스를 지정하면 모든 구현체/자식에 적용
@ControllerAdvice(assignableTypes = BaseController.class)
public class BaseControllerExceptionHandler {
}
```

### 특정 어노테이션에만 적용

```java
@ControllerAdvice(annotations = RestController.class)
public class RestControllerExceptionHandler {
    // @RestController가 붙은 클래스에만 적용
}
```

## 공통 모델 속성 추가 (@ModelAttribute)

### 모든 컨트롤러에 공통 데이터 제공

```java
@ControllerAdvice
public class GlobalModelAttributeHandler {

    @Value("${app.host}")
    private String applicationHost;

    @Value("${app.static-host}")
    private String staticHost;

    @ModelAttribute
    public void addAttributes(Model model) {
        model.addAttribute("applicationHost", applicationHost);
        model.addAttribute("staticHost", staticHost);
        model.addAttribute("currentYear", Year.now().getValue());
    }
}
```

### 세션에서 사용자 정보 추출

```java
@ControllerAdvice
public class UserModelAttributeHandler {

    @ModelAttribute("currentUser")
    public User getCurrentUser(HttpSession session) {
        return (User) session.getAttribute("user");
    }

    @ModelAttribute
    public MessageUser messageUser(HttpServletRequest request) {
        HttpSession session = request.getSession();
        MessageUser user = (MessageUser) session.getAttribute("messageUser");

        if (user == null) {
            String query = "";
            if (request.getQueryString() != null) {
                query = "?" + request.getQueryString();
            }
            throw new UnauthorizedException(request.getRequestURI() + query);
        }

        return user;
    }
}
```

### 컨트롤러에서 ModelAttribute 사용

```java
@Controller
public class DashboardController {

    @GetMapping("/dashboard")
    public String dashboard(@ModelAttribute("currentUser") User user, Model model) {
        // currentUser를 바로 사용 가능
        model.addAttribute("welcomeMessage", "Hello, " + user.getName());
        return "dashboard";
    }
}
```

## 인증 예외 처리

### 로그인 페이지로 리다이렉트

```java
@ControllerAdvice
public class SecurityExceptionHandler {

    @Value("${app.host}")
    private String applicationHost;

    @ExceptionHandler(UnauthorizedException.class)
    public String handleUnauthorized(UnauthorizedException e) {
        String encodedPath = "";
        try {
            encodedPath = "?redirect=" + URLEncoder.encode(e.getMessage(), "UTF-8");
        } catch (UnsupportedEncodingException ex) {
            // 무시
        }

        return "redirect:" + applicationHost + "/auth/login" + encodedPath;
    }

    @ExceptionHandler(AccessDeniedException.class)
    public String handleAccessDenied(AccessDeniedException e, Model model) {
        model.addAttribute("errorMessage", "접근 권한이 없습니다.");
        return "error/403";
    }
}
```

### REST API용 인증 예외 처리

```java
@RestControllerAdvice
public class RestSecurityExceptionHandler {

    @ExceptionHandler(UnauthorizedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleUnauthorized(UnauthorizedException e) {
        return new ErrorResponse(
            HttpStatus.UNAUTHORIZED.value(),
            "Unauthorized",
            "로그인이 필요합니다."
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleAccessDenied(AccessDeniedException e) {
        return new ErrorResponse(
            HttpStatus.FORBIDDEN.value(),
            "Forbidden",
            "접근 권한이 없습니다."
        );
    }
}
```

## 데이터 바인딩 커스터마이징 (@InitBinder)

### 날짜 포맷 설정

```java
@ControllerAdvice
public class GlobalBindingHandler {

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        // 날짜 형식 설정
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        dateFormat.setLenient(false);
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));

        // LocalDate 형식 설정
        binder.registerCustomEditor(LocalDate.class, new PropertyEditorSupport() {
            @Override
            public void setAsText(String text) throws IllegalArgumentException {
                setValue(LocalDate.parse(text, DateTimeFormatter.ISO_DATE));
            }
        });
    }
}
```

### 문자열 트리밍

```java
@ControllerAdvice
public class StringTrimmerAdvice {

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        // 빈 문자열을 null로 변환, 앞뒤 공백 제거
        StringTrimmerEditor stringTrimmer = new StringTrimmerEditor(true);
        binder.registerCustomEditor(String.class, stringTrimmer);
    }
}
```

## 실전 예제: 완전한 예외 처리 구현

```java
@RestControllerAdvice
@Slf4j
public class GlobalRestExceptionHandler {

    // 비즈니스 예외
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e) {
        log.warn("Business exception: {}", e.getMessage());

        ErrorResponse error = ErrorResponse.builder()
            .status(e.getStatus().value())
            .error(e.getStatus().getReasonPhrase())
            .message(e.getMessage())
            .code(e.getErrorCode())
            .build();

        return ResponseEntity.status(e.getStatus()).body(error);
    }

    // 리소스 없음
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(ResourceNotFoundException e) {
        log.info("Resource not found: {}", e.getMessage());
        return new ErrorResponse(404, "Not Found", e.getMessage());
    }

    // 유효성 검증 실패
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ValidationErrorResponse handleValidation(MethodArgumentNotValidException e) {
        log.info("Validation failed");

        List<FieldError> fieldErrors = e.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> new FieldError(
                error.getField(),
                error.getDefaultMessage(),
                error.getRejectedValue()
            ))
            .collect(Collectors.toList());

        return new ValidationErrorResponse(
            400,
            "Validation Failed",
            "입력값을 확인해주세요.",
            fieldErrors
        );
    }

    // 잘못된 요청 파라미터
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleConstraintViolation(ConstraintViolationException e) {
        String message = e.getConstraintViolations()
            .stream()
            .map(v -> v.getPropertyPath() + ": " + v.getMessage())
            .collect(Collectors.joining(", "));

        return new ErrorResponse(400, "Bad Request", message);
    }

    // HTTP 메서드 불일치
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    public ErrorResponse handleMethodNotAllowed(HttpRequestMethodNotSupportedException e) {
        return new ErrorResponse(
            405,
            "Method Not Allowed",
            e.getMethod() + " 메서드는 지원하지 않습니다."
        );
    }

    // 요청 본문 파싱 실패
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleMessageNotReadable(HttpMessageNotReadableException e) {
        return new ErrorResponse(
            400,
            "Bad Request",
            "요청 본문을 파싱할 수 없습니다."
        );
    }

    // 기타 모든 예외
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleAllExceptions(Exception e) {
        log.error("Unexpected error", e);

        return new ErrorResponse(
            500,
            "Internal Server Error",
            "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
    }
}
```

### 커스텀 예외 클래스

```java
@Getter
public class BusinessException extends RuntimeException {
    private final HttpStatus status;
    private final String errorCode;

    public BusinessException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }
}

public class ResourceNotFoundException extends BusinessException {
    public ResourceNotFoundException(String resourceName, Long id) {
        super(
            resourceName + " not found with id: " + id,
            HttpStatus.NOT_FOUND,
            "RESOURCE_NOT_FOUND"
        );
    }
}
```

## 주의사항

### 예외 처리 우선순위

더 구체적인 예외 핸들러가 먼저 적용됩니다:

```java
@ExceptionHandler(RuntimeException.class)
public ErrorResponse handleRuntime(RuntimeException e) {
    // RuntimeException 처리
}

@ExceptionHandler(IllegalArgumentException.class)  // RuntimeException의 하위 클래스
public ErrorResponse handleIllegalArgument(IllegalArgumentException e) {
    // IllegalArgumentException은 이 핸들러가 처리
}
```

### 여러 ControllerAdvice 우선순위

`@Order` 어노테이션으로 우선순위를 지정할 수 있습니다:

```java
@ControllerAdvice
@Order(1)  // 낮은 숫자가 높은 우선순위
public class HighPriorityExceptionHandler {
}

@ControllerAdvice
@Order(2)
public class LowPriorityExceptionHandler {
}
```

## 결론

`@ControllerAdvice`는 Spring MVC 애플리케이션에서 횡단 관심사를 효과적으로 분리하는 핵심 기능입니다. 전역 예외 처리를 통해 일관된 에러 응답을 제공하고, 공통 모델 속성으로 중복 코드를 줄일 수 있습니다. REST API 개발 시에는 `@RestControllerAdvice`를 활용하여 JSON 형태의 에러 응답을 깔끔하게 구현하세요.

## 참고 자료

- [Spring @ControllerAdvice 문서](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-advice.html)
- [Spring Exception Handling](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet/exceptionhandlers.html)
