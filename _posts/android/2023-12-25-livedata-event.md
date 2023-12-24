---
layout: post
title: "Simple Android Architecture : LiveData and event"
date: 2023-12-25 01:05:37 +0900
categories: android
---
This is one of [series of Simple Android Architecture](https://github.com/dss99911/kotlin-simple-architecture/tree/android-architecture). and you can check sample code there.

This article is about _Livedata_ and [_Event_](https://github.com/android/architecture-samples/blob/master/app/src/main/java/com/example/android/architecture/blueprints/todoapp/Event.kt)

When you use MVVM, you would find that there are two cases of data

1. Just data which is shown on layout
2. The event which should be called one time even if Activity/Fragment is recreated. like toast, dialog, starting activity.

Someone says that viewLifecycleOwner solved the issue, but In my understanding it just solved the memory leak.

And the two cases are difficult to be merged to one case, as the purpose are different.

# Solutions

Then how to handle the event?

1. [_Event_](https://github.com/android/architecture-samples/blob/master/app/src/main/java/com/example/android/architecture/blueprints/todoapp/Event.kt) class used in Android [_architecture-samples_](https://github.com/android/architecture-samples)
2. similar to MVP way. set Activity/Fragment on ViewModel by some interface.

# Deep Understanding

Let’s look deep into two ways

1. Event  
    - Pros : It’s lifecycle-aware. so, you don’t need to worry if event is called when Activity/Fragment’s is not running.  
    - Cons : if the data is shown on layout and also need to handle event, the readability not that good.(use _peekContent_() in the sample below)  
    - Cons : if use with [_Resource_](https://developer.android.com/jetpack/docs/guide#addendum), too much of depth of generic type is required  
    MutableLiveData<Event<Resource<String>>>().

{%- highlight kotlin -%}
class SampleViewModel : ViewModel() {
    val toastText = MutableLiveData<Event<String>>()
    fun onClick() {
        toastText.value = "aaa"
    }
}
class SampleFragment : Fragment() {
    onActivityCreated() {
        viewModel.toastText.observe(viewLifecycleOwner) {
            toast(it)
        }
    }
}
{%- endhighlight -%}

{%- highlight xml -%}
<TextView   
    android:text="@{model.toastText.peekContent()}"  
/>
{%- endhighlight -%}


1. Activity/Fragment on ViewModel  
    Pros : handle multiple parameter easily  
    Cons : need to set Activity/Fragment on created.  
    Cons : lifecycle un-aware.  
    Cons : if event and layout both is required. need to handle separately like the sample below

{%- highlight kotlin -%}
class SampleFragment : Fragment(), SampleUi {
    onCreate() {
        viewModel.ui = WeakReference(this)
    }
    override fun goToNextPage(val text: String) {
        toast(text)
    }
}
interface SampleUi {
    fun showToast(val test: String)
}
class SampleViewModel : ViewModel() {
    lateinit var ui: SampleUi
    val toastText = MutableLiveData<String>()
    fun onClick() {
        val TEXT = "test"
        toastText.value = TEXT
        ui.get()?.showToast(TEXT)
    }
}
{%- endhighlight -%}
{%- highlight xml -%}
<TextView   
    android:text="@{model.toastText}"  
/>
{%- endhighlight -%}


# Suggestion

There are merits and demerits on both way.

In my opinion _Event_ has more merits, but still has demerits.  
so, I focused on how to reduce demerits of _Event_ class

And, I suggest the below

{%- highlight kotlin -%}
class SampleViewModel : ViewModel() {
    val toastText = LiveObject<String>()
    fun onClick() {
        toastText.value = "aaa"
    }
}
class SampleFragment : Fragment() {
    onActivityCreated() {
        viewModel.toastText.observeEvent {
            toast(it)
        }
    }
}
{%- endhighlight -%}
{%- highlight xml -%}
<TextView   
    android:text="@{model.toastText}"  
/>
{%- endhighlight -%}


I used custom LiveObject class.

# Explanation

When you define LiveData field, you have to consider the below

1. **LiveData, MutableLiveData, MediatorLiveData (3 cases)**
2. **whether it’s Event or not. (2 cases)**
3. **whether it’s Resource or not (2 cases)**

Total, there are 12 cases to consider.  
Sometimes, requirement is changed, and you have to change the type again and again.

**Explanation for 1.**

Normally LiveData is used in view side not to change MutableLiveData’s value.

but, mostly, we don’t mistake it. and we can verify by test code.

So, I would like to use just one class for LiveData, MutableLiveData, MediatorLiveData

**Explanation for 2.**

There is a data which should be shown on UI. Designer decide to show it by TextView in layout.  
After that, it’s changed to AlertDialog.

In this case, the data is not changed, but we have to change MutableLiveData<String> to MutableLiveData<Event<String>>

Don’t you think it’s strange? even when data is not changed, but we have to change ViewModel.

so, I wrap LiveData class with custom class. and then view side decide if it’s event or not by the below way

{%- highlight kotlin -%}
viewModel.toastText.observe {  
    txt_toast.text = it  
}
viewModel.toastText.observeEvent {  
    toast(it)     
}
{%- endhighlight -%}


When it’s event, use observeEvent(), if it’s not event, use observe()  
isn’t it simpler and also reasonable that view side decide event or not?

**Explanation for 3.**

we use [Resource](https://github.com/android/architecture-components-samples/blob/master/GithubBrowserSample/app/src/main/java/com/android/example/github/vo/Resource.kt) custom class for data including state of loading, success, fail.  
but, when you define LiveData for it, it’s terrible like

{%- highlight kotlin -%}
MutableLiveData<Event<Resource<String>>>>
{%- endhighlight -%}


So, I would like to suggest

{%- highlight kotlin -%}
LiveResource<String>
typealias LiveResource<T> = LiveObject<Resource<T>>
{%- endhighlight -%}

You don’t need to consider it’s Mutable or not, Event or not.

Just use these

{%- highlight kotlin -%}
LiveResource<String>  
LiveObject<String>
{%- endhighlight -%}


All the 12 cases get shorten to 2 cases. now It can be manageable.

You can check sample and library code [here](https://github.com/dss99911/kotlin-simple-architecture/tree/android-architecture)

Happy coding :)