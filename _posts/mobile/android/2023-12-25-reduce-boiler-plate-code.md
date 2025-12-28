---
layout: post
title: "Simple Android Architecture : MVVM concept and reduce boilerplate code on Activity/Fragment/ViewModel"
date: 2023-12-25 01:05:37 +0900
categories: [mobile, android]
---
This is one of [series of Simple Android Architecture](https://github.com/dss99911/kotlin-simple-architecture/tree/android-architecture). and you can check sample code there.

This article shows how to reduce boilerplate and how to focus on business logic only

# Prerequisite

- Jetpack Navigation
- Koin
- MVVM

Index

- Inflate layout and binding _ViewModel_
- To get _Activity’s_ _ViewModel_ or other _Fragment’s_ _ViewModel_
- How to create and bind _Fragment_, _ViewModel_, layout fast
- To observe _LiveData_ omitting _viewLifeCycleOwner_
- Explanation of MVVM concept
- Don’t implement frequently used UI functions repeatedly on _Activity/Fragment_, and just command on _ViewModel_
- How to remember the usage?

## Inflate layout and binding _ViewModel_
{%- highlight kotlin -%}
class MainFragment : BaseFragment() {  
    override val layoutId: Int = R.layout.fragment_main    
    val viewModel: MainViewModel by _bindingViewModel()
}
{%- endhighlight -%}

  

Just define layout and viewModel, then they’ll be bound automatically.

If you don’t need viewModel or need multiple viewModel. you can do it.

What you have to do is

- To use _BaseFragment, BaseActivity, BaseViewModel_
- Inject _ViewModel_ by _Koin_ (_bindingViewModel()_ use _Koin)_

## To get Activity’s ViewModel or Other Fragment’s ViewModel
{%- highlight kotlin -%}

class OtherViewModelFragment : BaseFragment() {
    override val layoutId: Int = R.layout.fragment_other_view_model

    val viewModel: OtherViewModelViewModel by bindingViewModel {
        parametersOf(getNavGraphViewModel<MainViewModel>(R.id.mainFragment))
    }
    val viewModel2: ParentViewModel by bindingViewModel {
        parametersOf(getActivityViewModel<MainActivityViewModel>())
    }
    
    val viewModel: NavArgsViewModel by bindingViewModel {
    parametersOf(getNavArgs<NavArgsFragmentArgs>())
    }

}
{%- endhighlight -%}


**_getNavGraphViewModel_** is from _Jetpack Navigation_ library. in order to use this, you have to use _Navigation_ on the _Fragment_.

**_getNavArgs_** is getting arguments of the _Fragment._ It’s data. so, It’s better to set to _ViewModel_ directly

## How to create and bind _Fragment_, _ViewModel_, layout fast

<iframe width="420" height="315" src="https://www.youtube.com/embed/s17bmlrFXSg" frameborder="0" allowfullscreen></iframe>


Normally, we use same name for Fragment, ViewModel, layout like SampleFragment, SampleViewModel, fragment_sample

So, I created the android studio live template for that.

**fragment**

```
# Template Text
class $NAME$ : BaseFragment() {  
    override val layoutId: Int = R.layout.$LAYOUT_NAME$
    $END$  
}

# Variable - NAME
fileNameWithoutExtension()  

# Variable - LAYOUT_NAME
groovyScript("String withoutFragment = _1.substring(0, _1.indexOf('Fragment')); String underlineCase = withoutFragment.replaceAll(/[A-Z]/) { '_' + it }.toLowerCase(); return 'fragment' + underlineCase", fileNameWithoutExtension())
```
**bindingViewModel**

```
# Template Text

val viewModel: $NAME$ViewModel by bindingViewModel()

# Variables - NAME
groovyScript("return _1.substring(0, _1.indexOf('Fragment'))", kotlinClassName())

```

**bindingViewModelActivity**

```
# Template Text

val viewModel: $NAME$ViewModel by bindingViewModel {  
    parametersOf(getActivityViewModel<$VIEWMODEL$>())  
}

# Variables - NAME
groovyScript("return _1.substring(0, _1.indexOf('Fragment'))", kotlinClassName())
```

If I can create Intellij plugin, I would like to make plugin to create and bind these automatically. but, for now, no plan.

## To observe LiveData omitting viewLifeCycleOwner

{% highlight kotlin %}
items.observe {  
    showSnackbar(R.string.loading_tasks_error)  
}
{% endhighlight %}


you can omit it by the function in BaseFragment below

{%- highlight kotlin -%}
fun <T> LiveObject<T>.observe(onChanged: (T) -> Unit) {
    observe(viewLifecycleOwner, onChanged)
}
{%- endhighlight -%}

## **Explanation of MVVM concept**

Before next part, I would like to explain about MVVM concept

> View doesn’t think anything. just show UI with data.
> 
> ViewModel think ui logic, get data from model, command View to show the data
> 
> Model think data logic and manufacture data from various source

It means that _View_ **doesn’t command** _ViewModel_ to do something

{%- highlight kotlin -%}
class MainFragment : BaseFragment() {
    fun onClick() {
        viewModel.loadData()
    }
}
{%- endhighlight -%}


_loadData_ on the example is not proper naming  
because, _View_ command _ViewModel_ to load data

{%- highlight kotlin -%}
class MainFragment : BaseFragment() {
    fun onClick() {
        viewModel.onClick()
    }
}
{%- endhighlight -%}


this is appropriate, View doesn’t command, instead, deliver event from user action or Activity/Fragment event

## Don’t implement frequently used UI functions repeatedly on _Activity/Fragment_, and just command on _ViewModel_

**Activity/Fragment Lifecycle event**

{%- highlight kotlin -%}
class MainViewModel : BaseViewModel() {

    override fun onResume() {
        //do ui logic on resume event
    }
}
{%- endhighlight -%}


Sometimes, we do some process onResume, onPause, onStart, onStop.  
As _View_ just deliver event to _ViewModel,_ there is **_onResume_()** function on _BaseViewModel_, and _BaseFragment_ deliver event to _BaseViewModel._ what we have to do is just to override **_onResume()_** function and process logic.

**Navigation**
{%- highlight kotlin -%}
class BaseViewModel : ViewModel() {
    fun navigateDirection(navDirections: NavDirections)
    fun navigateUp()
    fun navigateDirection(id: Int)
}
{%- endhighlight -%}


_ViewModel_ command what _View_ do.  
_NavDirections_ contains which _Fragment_ to redirect to, and arguments of the _Fragment  
_I think Where to redirect is commanding part. and argument is data. so, I suggest to use the functions above on _ViewModel_ side. and _View_ side navigates by _ViewModel_’s command

**Dialogs(Snackbar, ProgressBar, AlertDialog, etc)**

Sometimes we shows dialogs on UI. If the UI customizing is required, we have to write code on _View_ side. but if it’s common UI, then we implement the dialogs on BaseActivity and BaseFragment just one time. and ViewModel just call **_showSnackbar(),_** and **_showProgressbar(), etc_** predefined on _BaseViewModel_

{%- highlight kotlin -%}
class SampleViewModel : BaseViewModel() {
   fun onClick() {
      if(!hasData) {
         showSnackbar(...)
         return
      }
      //do something
   }
}
{%- endhighlight -%}


**_ViewMode_ calls _startActivityForResult()_**

You must feel weird about this because _startActivity_ and _startActivityResult_ is _Activity_ or _Fragment_’s task not related to _ViewModel_.

Then, why don’t we use it in _ViewModel_?  
I think the reason is that _startActivityForResult_ method has dependency to _Activity_, and we need _requestCode_ as well.

Then, if no dependency exists, and _requestCode_ is not required?  
Even in this case, someone says that it’s _View_ side task. not _ViewModel_ side.

Let’s think.

we call _Activity_ with data and the _Activity_ returns data. the structure is totally same with logical _function. b = f(a)  
_Then, why don’t we use it like _function_ on _ViewModel_?

<script src="https://gist.github.com/dss99911/01dc67dda8783ed8b0c5c5eb38244822.js"></script>

about _load(), LiveResource_. kindly check [this]({% link _posts/android/2023-12-25-coroutine-retrofit.md %})

Even, testing also simple(check [test code](https://github.com/dss99911/simple-android-architecture/blob/5a68c88429e1e280d4d569cf6247ded4a8c5a577/sample/src/test/java/kim/jeonghyeon/sample/viewmodel/startactivity/StartActivityViewModelTest.kt))

I couldn’t find the answer why we shouldn’t do that on ViewModel. If you find, kindly let me know, I’ll remove this part.

**_ViewModel_ calls _requestPermissions()_**

This also same approach with the above. but request permission.

<script src="https://gist.github.com/dss99911/b25b236017052949d7ed326484ea62dc.js"></script>

## How to remember the usage?

I introduced a lot. and you may feel it’s learning curve.  
But, What you have to remember is just BaseActivity, BaseFragment, BaseViewModel.

And functions of them are commented on each class. [BaseFragment](https://github.com/dss99911/simple-android-architecture/blob/3fdcd9eea3eda8f66f643470da79bbeecef02be3/library/src/main/java/kim/jeonghyeon/androidlibrary/architecture/mvvm/BaseFragment.kt) for example  
So, just use the functions mentioned on the comment. and it’s not mandatory to understand inner structure.

All library code, and sample code exists on [this repo](https://github.com/dss99911/kotlin-simple-architecture/tree/android-architecture)


You may feel it’s weird or inappropriate on some part.  
I also agree on the perspective and also understand the reason somehow.

But, I couldn’t find why we shouldn’t do that. and removing repeated code is important.  
and someone may be worry that ViewModel get bigger as all the code is in the ViewModel.  
but, It’s not like that, at first, on the code above, _ViewModel_ just commanded _View_ side, not adding _View_ side code on _ViewModel_.  
And the code above do is just removing repeated code of _View_ side only.  
so, _ViewModel_ side doesn’t get bigger.

And if _ViewModel_ get bigger because of some complicated business logic.  
I recommend to move logic to _Model_ side if it’s not related to UI. Actually, _ViewModel_ is related to _View_. so, _ViewModel_ shouldn’t know about processing of data, instead, _ViewModel_ just know the result of processing of data

It’s up to you accept the way or not. And I always welcome any feedback.

Happy coding :)