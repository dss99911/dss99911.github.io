---
layout: post
title: "Android Coroutine API Call and Error Handling in Retrofit2"
date: 2023-12-25 01:05:37 +0900
categories: [mobile, android]
description: "Compare 5 approaches for Android API calls: Threading, Callback, Chaining, RxJava, and Coroutine. Learn why Kotlin Coroutines provide the simplest and most maintainable code."
tags: [Android, Kotlin, Coroutine, Retrofit, API, Error Handling, MVVM]
---
This is one of [series of Simple Android Architecture](https://github.com/dss99911/kotlin-simple-architecture/tree/android-architecture). and you can check sample code there.

In the Api call, There are 5 approaches explained on [Kotlin coroutine Tutorial](https://kotlinlang.org/docs/tutorials/coroutines/async-programming.html)  
This article will explain the difference of each. and why we have to use Coroutine. and how to use it simple.

1. Threading
2. Callback (ex: Listener)
3. Chaining (ex: LiveData)
4. Reactive Extensions (ex: RxJava)
5. Coroutine

# Index

1. Example of 5 approaches
2. Why use Coroutine
3. Suggestion of Coroutine Usage

# Prerequisite

In this article, I use these knowledge. If you don’t have experience of that, Kindly check the link below.

- [_Resource_](https://developer.android.com/jetpack/docs/guide#addendum) : _Resource_ is data which containing status (loading, success, error)
- [_LiveResource_]({% link _posts/android/2023-12-25-livedata-event.md %}) : this is _LiveData<Resource>_
- [_LiveData_](https://developer.android.com/topic/libraries/architecture/livedata) : _MediatorLiveData, Transformations.switchMap()_
- [_Retrofit2_](https://square.github.io/retrofit/) : especially knowledge of _CallAdapter_
- [Kotlin Coroutine](https://kotlinlang.org/docs/tutorials/coroutines/async-programming.html) : this article handle how to use coroutine, instead what is Coroutine
- MVVM, Observer pattern

# Example of 5 approaches

I’ll show the example of calling 2 apis in sequence  
You can see the difference by them.

## Threading

<script src="https://gist.github.com/dss99911/ec91de85c4ec40ba9a8ac650c054d5c3.js"></script>

You may be curious how to handle error. It’s explained on “_Suggestion of Coroutine Usage_” part below

`load()` function can be used for common. so, for two apis, we added just 2 line code only.  
In code simplicity, readability, maintenance perspective, _Thread_ looks nice.

But, There are [performance drawbacks](https://kotlinlang.org/docs/tutorials/coroutines/async-programming.html#threading)

So, in _MVP_ period, we used callback even if the code readability not that good.

## Callback

<script src="https://gist.github.com/dss99911/69764569846e3d20f4d0b3243acbf166.js"></script>

If you see `postItem()`, you can easily read because it shows business logic only

But, There are some drawbacks

1. `getToken()`, `submitPost()` is required to keep good readability. and they are boilerplate code which is not necessary in _Threading_ approach.
2. if the logic gets more complicated and need many asynchronous calls, we need much of lambda block and it increases code depth making code as tree
3. comparing to top-down imperative approach(like _Threading_), It’s difficult to make logic like loop, conditional api call, etc.

see [more drawbacks](https://kotlinlang.org/docs/tutorials/coroutines/async-programming.html#callbacks)

That’s why Chaining or Reactive Extensions approaches come out.

## Chaining

Actually, I call it ‘chaining’ because this approach chains the calls. but I don’t know proper designation.

<script src="https://gist.github.com/dss99911/81df78bc38d7b9afdacebb31bc68fc11.js"></script>

`plusAssign()` : You can set the result of api call to _result_ field by operator of ‘+=”  
`successSwitchMap()` : switch LiveData only when it’s success. if it’s error, directly set error to _result_ field. this can be used in common use  
`LiveResource` : api returns _LiveResource, it contains success and fail both case by_ [_CallAdapter_](https://github.com/dss99911/simple-android-architecture/blob/fb406cc86ce2ebfbd48ab64b51c6293b09ca9ebb/sample/src/main/java/kim/jeonghyeon/sample/apicall/chaining/LiveDataCallAdapter.kt)

This approach has some merit below

1. The code is simpler than _Callback_ approach(just 2 line of code). and returns `LiveResource` which is already used in _View and ViewModel side_. so, you don’t need to study new concepts
2. apis are called by chaining methods, not increasing the code depth unlike _Callback_ approach.

But, There are some drawbacks as well.

1. Though lambda block depth is not increased,  
    Yet, each call is divided by _switchMap_(). so, it’s difficult to communicate between each _swithMap_ code block
2. There are [detailed drawbacks](https://kotlinlang.org/docs/tutorials/coroutines/async-programming.html#futures-promises-et-al)

## Reactive Extensions

<script src="https://gist.github.com/dss99911/4a230fafee19b5fe368d514a89c431cf.js"></script>

Now, we are looking into RxJava.  
Actually, I’m not sure I’m qualified to explain RxJava, as I didn’t have deep experience to use it. If There is something wrong, kindly understand me and let me know to fix it.

There are some merits of RxJava comparing to Chaining

- A lot of developers use and contribute. so, it will evolve continuously
- Easy error handling
- Easy thread setting
- Easy parallel api call
- Lots of functional operators
- Supporting lots of platforms and language. we can experience same in various platform and language.

And there is famous phrase for _RxJava_

> everything is a stream, and it’s observable

Stream may be used for various cases to handle gracefully.

But, I don’t want to handle the cases on this article.

I’ll handle only two cases below. because, we mostly experience the two cases only when call api and handle UI

- single data -> use `suspend` function
- changeable data -> use `LiveData`

# Why use _Coroutine_?

Finally, I introduce _Coroutine_.

<script src="https://gist.github.com/dss99911/e55d974cdff95b269f796a99fd6d820b.js"></script>

When you see, the returned data is just data not wrapped by _LiveResource_ or _Flowable_ or _Retrofit_’s _Response_  
It means that we don’t need new concept any more. we can return to _Threading_ approach satisfying performance(_Coroutine_ solves it by observer pattern which _Callback, Chaining, RxJava approach also used._).

_RxJava_ provides a lot of functional operators for supporting everything.  
But, in other words, _Chaining_ approach has a lot of limitation like looping, exception handling, conditional api call, parallel api call, communication between each calls, etc.  
and RxJava is originated from _Chaining,_ That’s why RxJava provides much of operators to cover them.

but, if we call the asynchronous api in synchronous way and the api returns actual data(not wrapped), we can process easily and straight-forwardly the complicated logic which the _Chaining_ approach has to process complicatedly.

# Suggestion of Coroutine Usage

The concept is same with the sample code of Coroutine.

As sample shows just simple case, I would like to explain how to handle complicated case below in simple way.

- Handle sever’s logical error
- Error handling in UI
- Handle Error in Logic
- Multiple api call in parallel
- Api polling
- Debounce
- Call in idle(prevent duplicated api call by clicking button in a second)
- Retry
- Handle changes in _Room_ database

## Handle sever logical error

There are two suggestions

- Handle error by try catch
- Api returns only success data

**Handle error by try catch**

In the _Coroutine_ example, you may find that errors are handled by ‘_try catch’_.

Normally, when we use synchronous api call, we handle errors by _Resource or Response_ in _Retrofit._ because api can be failed, so returned value should contains status as well.

I used _Retrofit_’s _Response_ for the example.

{%- highlight kotlin -%}
val tokenResponse = api.getToken()
if (tokenResponse.isSuccessful) {
    val submitResponse = api.submitPost(PostRequestBody(tokenResponse.body()!!, item))
    if (submitResponse.isSuccessful) {
        result.postSuccess(Unit)
    } else {
        result.postError()
    }
} else {
    result.postError()
}
{%- endhighlight -%}

You can see a lot of `if else` condition. and it makes difficult to understand the business logic. so that, difficult to maintain the code as well.

Then what we have to do?

Let’s think about other error cases like reading data from database, or converting String to Int. mostly we use exception and `try catch`.

If `try catch` is the common way of error handling,  
instead of using different way, to unify error handling to `try catch` will make code simpler and maintainable.

So, I decided to throw exception if it’s not success case.  
So that, we can focus on success case only.

**Api returns only success data**

Normally, we define response body like below
{%- highlight json -%}
{  
    status : "success",  
    data : {  
        "posts" : [  
            { "id" : 1, "title" : "A blog post", "body" : "Some useful content" },  
            { "id" : 2, "title" : "Another blog post", "body" : "More content" },  
        ]  
     }  
}
{%- endhighlight -%}


The response body contains data and status.  
It’s not matter whether server send data in this structure or just send success data. because, _Retrofit_ `CallAdapter` can throw exception on fail case whatever it is.

But, I would like to suggest sever send only success data.

Then, How to handle error?  
In response, there is a ‘code’ field which shows success or other system errors from 2xx ~ 5xx

As, the code use until 5xx only. what if we decide custom error code above 600 for logical error or 500 internal server error?  
And, if it’s success, returns only success data. if it’s fail, returns only fail data

Then what is the benefit of it?  
server side code also can be simple

When wrapped by `ResponseBody` (example used _Spring framework_)

{%- highlight java -%}
@GetMapping
public ResponseBody<SomeData> getSomeData() {
   if (isFail) {//1st way of handling fail
      throw new CustomeException("unknown error")
   }
   if (isFail2) {//2nd way of handling fail
      return ResponseBody.fail(...)
   }
   return ResponseBody.success(new SomeData())
}
//for 1st way of handling fail
@ExceptionHandler(CustomException.class)
public ResponseEntity handleCustomException(HttpServletRequest request, CustomException exception) {
   new ResponseEntity<>(ResponseBody.fail(...), ..., HttpStatus.OK)
}
{%- endhighlight -%}

Without `ResponseBody`

{%- highlight java -%}
@GetMapping
public SomeData getSomeData() {
   if (isFail) {//1st way of handling fail
      throw new CustomeException("unknown error")
   }
   return new SomeData()
}
@ExceptionHandler(CustomException.class)
public ResponseEntity handleCustomException(HttpServletRequest request, CustomException exception) {
   new ResponseEntity<>(FailData(...), ..., LOGICAL_ERROR_CODE)
}
{%- endhighlight -%}


You can see that returned value is just success data.

for me, it looks natural. in programming language, function return just data and if it’s fail, it just throw exception.

**Error handling in UI**

We covered, on the above, that how to process api call or asynchronous call.  
Api returns actual data and throw exception on fail case.

we normally use `LiveData` for view side to show the data(maybe it’ll be changed if _Jetpack Compose_ is released), _Coroutine_ sample shows that `LiveResource<T>.load()` converts data and exception to `Resource`_._ so, we don’t need to set data to `LiveData` manually.

After that, view side handle `Resource`, and if it’s progressing, show progress bar. if it’s fail, we shows snack bar or toast or some message in layout, etc. like below.

{%- highlight kotlin -%}
viewModel.state.observe { it: Resource
    if (it.isLoading()) {
        progressDialog.show()
    } else {
        progressDialog.dismiss()
    }

    dismissSnackbar(binding.root)// if state is changed, dismiss snackbar if it's shown.

    it.onError {
        showErrorSnackbar(binding.root, it.retry)
    }
}
{%- endhighlight -%}

Normally, there are two cases to show error ui.

- When Activity/Fragment is created
- When user action like clicking button

For development efficiency and design consistency, we normally shows same format of error on UI.

in this case, Let’s base code do it automatically.

for detailed explanation, [_BaseViewModel_](https://github.com/dss99911/simple-android-architecture/blob/fb406cc86ce2ebfbd48ab64b51c6293b09ca9ebb/library/src/main/java/kim/jeonghyeon/androidlibrary/architecture/mvvm/BaseViewModel.kt) has `state` and `initState` fields for common error handling and [_BaseActivity_](https://github.com/dss99911/simple-android-architecture/blob/3fdcd9eea3eda8f66f643470da79bbeecef02be3/library/src/main/java/kim/jeonghyeon/androidlibrary/architecture/mvvm/BaseActivity.kt) or [_BaseFragment_](https://github.com/dss99911/simple-android-architecture/blob/3fdcd9eea3eda8f66f643470da79bbeecef02be3/library/src/main/java/kim/jeonghyeon/androidlibrary/architecture/mvvm/BaseFragment.kt) observe them automatically.  
so, if it’s common error ui case, you don’t need to add code for handle error ui.  
just load data like below. that’s it (I explained about `BaseViewMode`, `BaseActivity`, `BaseFragment` on [another article]({% link _posts/android/2023-12-25-reduce-boiler-plate-code.md %}))

{%- highlight kotlin -%}
state.load {  
    api.getToken()  
}
{%- endhighlight -%}


**Handle Error in Logic**

in the above, I showed how view side handle error. but what if we have to handle error in viewModel side or use case side?

It’s very simple. handle it like normal fail case. just do `try catch`.

{%- highlight kotlin -%}
result.load {
    val token = try {
        api.getToken()
    } catch (e: ResourceException) {
        "guest token"
    }
    api.submitPost(PostRequestBody(token, item))
}
{%- endhighlight -%}

**Multiple api call in parallel**

<script src="https://gist.github.com/dss99911/162dfc156baa94bad73910e7e80f89d2.js"></script>

It’s very simple as well.  
What you have to do is to use `async()` _Coroutine_ function and `await()`

Sometimes we call several apis in parallel, and we worry if there are 5 apis and 4 apis are success but 1 api is failed. do we have to call 5 apis again? or just call 1 api? it depends on business logic. but if you have to call the failed one api. It also simple to implement.

**Api polling**

After some transaction, client wait server’s decision if the transaction is success or fail. and client call status checking api repeatedly.

for that, we don’t need any special function to do that.

<script src="https://gist.github.com/dss99911/d7d105d68c568c0218b3cf7387261623.js"></script>

It’s very simple. and straight-forward to understand. isn’t it?

But, `delay()` or `for()` looks boilerplate code which is able to shorten to 1 function

<script src="https://gist.github.com/dss99911/6410071367ae15a7575eefa18515631f.js"></script>

It’s up to you whether to use utility function `polling()` or not.  
whatever it is, it’s readable and simple.

**Debounce**

I found there is debounce operator in RxJava  
So, I implement it on Coroutine way.

<script src="https://gist.github.com/dss99911/3bd3c386c5fab528310b7ad4914ce0fa.js"></script>

It’s quite simple, just add `LiveResource.loadDebounce()`

{%- highlight kotlin -%}
override fun <T> LiveResource<T>.loadDebounce(
    timeInMillis: Long,
    work: suspend CoroutineScope.() -> T
) {
    value?.onLoading { it?.cancel() }
    load {
        delay(timeInMillis)
        work()
    }
}
{%- endhighlight -%}

You can do by yourself, as the implementation is simple.  
But, cancelling job, and delaying can be shorten to one function. so, I added `loadDebounce` function

**Call in idle**

{%- highlight kotlin -%}
state.loadInIdle {
    api.submitPost(...)
}
override fun <T> LiveResource<T>.loadInIdle(work: suspend CoroutineScope.() -> T) {
    if (value.isLoadingState()) {
        return
    }
    load(work)
}
{%- endhighlight -%}

I think no need more explanation. if it’s already called and loading, then ignore api call.

**Retry**

When api call is failed, it’s simple to retry, just call the api again.  
But, if there is common error ui. and ui shows retry button.  
we should set the click listener. and the listener call the api on every retry button.

So, I added retry field on `Resource.Error`. so that, view side can retry if Resource is Error

{%- highlight kotlin -%}
sealed class Resource<out T> {
    data class Loading(val job: Job? = null) : Resource<Nothing>()
    data class Success<T>(val data: T) : Resource<T>()
    data class Error(val error: ResourceError, val retry: () -> Unit = {}) : Resource<Nothing>() {
        init {
            log(error)
        }
    }
}
{%- endhighlight -%}

<script src="https://gist.github.com/dss99911/aa3a2a432bcb5da5db82691a8b9de5df.js"></script>

What you have to do is just call the api. then `BaseViewModel`, `BaseFragment` will show snackbar, and when user click retry button, it will retry automatically.

**Handle changes in _Room_ database**

I explained merit of _Coroutine_ and _suspend_ function.  
But, There are some cases in which LiveData is required.  
_suspend_ function is only for single time.  
but like the below. in some case, we need to observer changes. and in this case, we have to use LiveData instead of _suspend_ function.

{%- highlight kotlin -%}
@Query("SELECT * FROM Tasks order by entryid")
fun getTasks(): LiveData<List<Task>>
{%- endhighlight -%}

You can check the example on [the repository](https://github.com/dss99911/kotlin-simple-architecture/tree/android-architecture). you can test by running ‘sample’ module.

Any issue or feedback, Kindly let me know.  
I’ll really appreciate it.

Happy coding :)