---
layout: post
title: use Android RecyclerView with 2 lines
date: 2023-12-25 01:05:37 +0900
categories: [mobile, android]
tags: [android, recyclerview, kotlin, ui, adapter]
image: /assets/images/posts/thumbnails/recyclerview-simple.png
redirect_from:
  - /mobile/android/2023/12/25/recyclerview-without-redundancy.html
---
This is one of [series of Simple Android Architecture](https://github.com/dss99911/kotlin-simple-architecture/tree/android-architecture). and you can check sample code there.

this article introduces simple way to use RecyclerView

when we use RecyclerView, we do the below

1. create a classe extends RecyclerView.Adapter  
    overrides getItemViewType(), onCreateViewHolder(), onBindViewHolder()
2. create a class extends RecyclerView.ViewHolder, bind data into view
3. set Adapter to RecyclerView

But, design only require only two of the below

- list data
- item’s layout

The below is the sample of them for explaining.
<script src="https://gist.github.com/dss99911/17fd5957cd19360a11058912396f6b90.js"></script>

<script src="https://gist.github.com/dss99911/af4e560f4d60ed4ff87710f5e30154db.js"></script>

# Suggestion

I suggest the below

<script src="https://gist.github.com/dss99911/6aaa653e3f5e24c2868e79e7a8d5a79f.js"></script>

You don’t need to implement RecyclerView.Adapter and much of boilerplate codes  
Just add 2 line. _itemList, itemLayoutId_. That’s it

Even you don’t need to remember the attributes’ name. Android Studio suggest them.


![](/assets/images/posts/android/1_lDVK6kZj3XFcs3f2T-tWDw.webp)

If you are curious how it works. please checkout the library and check. it’s mentioned in the end of this article

# Limitation

but, There are some limitation in the approach above if requirement is little more complicated

1. If Good performance on drawing items is required.
2. If LiveData is required.
3. If several viewType is reuiqred
4. Paging by api

# How to cover the limitation

I believe that if requirement is simple, code also should be simple. if requirement is complicated, code also get little bit complicated. but still should minimize the boilerplate code with reasonable structure and also should be readable.

1. **If Good performance on drawing items is required.**  
    use DiffUtil.ItemCallback to let adapter knows that when invalidating ui is required.

<script src="https://gist.github.com/dss99911/8af9ada45c8f6857901081ef7b07eef6.js"></script>

DiffUtil.ItemCallback is abstract class. so, instead of it, let the item class implements DiffComparable which is custom interface of DiffUtil.ItemCallback.

Mostly you have to define the item’s class, in order to handle event like click. so, I think It’s ignorable boiler plate code to define item view model class(in the example, SimpleComparableListItemViewModel). and just implements DiffComparable, and mention if items are same or item’s contents are same.

<script src="https://gist.github.com/dss99911/7e047ecd4f6db4b535be74c53867986e.js"></script>

After that, change _itemList to itemListComparable._ from Android Studio suggestion.

That’s it, you can cover performance issue

**2. If LiveData is required**

the library use _data-binding_ library to bind item’s data to item’s layout.

but when RecyclerView.Adapter is created, the Adapter doesn’t know lifecycle of Fragment or Activity. so, when LiveData’s value is changed, value is not reflected on view.

with _@BindingAdapter_, It’s not possible for view to know fragment or activity.

so, I suggest the below

<script src="https://gist.github.com/dss99911/b1a4816b829b6a0933ddf29941a5946e.js"></script>

instead of using _BindingAdapter_, create adapter by _bindData()_ extension function and set _viewLifecyclerOwner_ to let adater to know it.

**3. If several viewType is reuiqred**

actually, I recommend to item’s layout include all view type’s layout and control each view type by visibility.

as I don’t recommend. I don’t provide sample, but just short explanation.

{%- highlight kotlin -%}
object: BaseRecyclerViewAdapter<Any>() {
    override fun getItemLayoutId(position: Int): Int {
        getLayoutId(getViewType(position))
    }
}
fun getViewType(position: Int): Int { /*todo*/ }
fun getLayoutId(viewType: Int): Int { /*todo*/ }
{%- endhighlight -%}

**4. Paging by api** 

Without Jetpack Paging library, it’s complicated to implement paging.  
but with Paging library, still it’s complicated to study and memorize and use the library.

so, I provide BaseNetworkDataSourceFactory to use it without understanding and memorizing Paging library

<script src="https://gist.github.com/dss99911/6b9317114f8b3d9e3e2a69fb51a5eafe.js"></script>

If you implemented BaseNetworkDataSourceFactory, just use same way with previous way.

<script src="https://gist.github.com/dss99911/14493a128cd57b7caecb4b6aae3dbdb1.js"></script>

<script src="https://gist.github.com/dss99911/a16b511bff78f7b639e6212bf02e44c0.js"></script>

# **Conclusion**

I provide the sample [here](https://github.com/dss99911/kotlin-simple-architecture/tree/android-architecture)

you can run sample application and see the code in the package of kim.jeonghyeon.sample.list

I think the code satisfies MVVM and OOP, but if you have find any problem or suggestion. Kindly let me know to improve it.

Happy coding :)