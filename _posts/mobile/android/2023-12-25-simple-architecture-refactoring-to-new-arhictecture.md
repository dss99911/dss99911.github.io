---
layout: post
title: "Simple Android Architecture : Refactoring to new architecture"
date: 2023-12-25 01:05:37 +0900
categories: [mobile, android]
---
![](/assets/images/posts/android/1_grWLNKMDiveBfzwv_FDjAA.webp)

This is one of [series of Simple Android Architecture](https://github.com/dss99911/kotlin-simple-architecture/tree/android-architecture). and you can check sample code there.

This article is about how to refactor with new base architecture  
(base architecture means that base code which is used on all the features. it includes utility classes as well)

#### **Index**

- Consideration of refactoring
- Separation of base architecture module
- Sample module
- Separation of each feature by module
- Difficulties on refactoring

### Consideration of refactoring

There are two approach in refactoring application.

1. refactor whole code
2. refactor one by one

I’ll explain about 2. because 1 requires a lot of cost.

If you refactor to new architecture. There’ll be two architectures coexist on one application. and has demerit below.

- It cause high learning curve to remember two architecture.
- Sometimes, two architecture can conflict and can’t solve gracefully.
- Other developers may be confused by new architecture.
- If the new architecture project is not used well, it just increase the code complexity

So, before deciding to introduce new architecture. think carefully.

### Separation of base architecture module

Firstly, Let’s think why we decide to refactor?  
When I see the code of the company I’m working, I found the below

- Code has a lot of boilerplate and duplicated code
- Each feature refers each others.
- Difficult to understand
- Difficult to see use-case and flow of business
- View, ViewModel, Model are mixed.
- Frustration to develop in this environment

Additionally, I found the problem below related to base architecture

- base architecture contains other feature’s code
- several base architecture exists. developers uses the architecture which they like  
    - MVP  
    - MVVM(has different approach. navigator, event, baseViewModel)  
    - Api call(listener, coroutine(has two different way as well), Livedata)
- a lot of copy/paste which should be provided by base class

What I did at the first time is to make separate module for new architecture.  
(if you see the [repo above](https://github.com/dss99911/simple-android-architecture#articles), there are ‘library’ module for base architecture)

The benefit by separation of architecture module.

- emphasize that new architecture is standard to follow in the company.
- separation of dependency
- new joiner easy to find which architecture and base code to use.
- only thoroughly verified code will be reflected to the architecture module

### Sample module

When I check existing architectures.  
It was not that bad at first time of introduction of the architecture. just it’s not maintained well and not used in good way.

So, I have thought what makes code messed up?

I think the reason is that there is no recommended code how to write the code well. and also there were no discussion about clean coding. and new joiner see the existing code, and just follow the not good code.

So, I decided to make sample application in sample module.   
and it’s benefit is the below

- new joiners’ background knowledge about architecture is different.  
    whether they know well or not, they can learn how to use base architecture easily
- every developer will write code in high quality and consistence, after learning sample.
- If developers forget the usage of the architecture, easy to find the usage in the sample
- If base architecture is updated(like reflecting Jetpack compose), you don’t need to worry. just see sample.

### Separation of each feature by module

When I check existing code,

- each different feature contains another feature’s code
- commonly used feature contains other feature’s code.
- To integrate with commonly used feature is difficult and no document for that.
- each feature’s some classes and codes are dispersed on different packages by function basis

I have thought the below

- If it’s commonly used feature, There should be document how to integrate with the feature.
- If it’s commonly used feature, when integrate it, the feature shouldn’t be changed because of integration.
- one feature’s codes should be found in a package.

so, I separated some features, which is used commonly and not much related to other features.   
and added readme.md explaining how to integrate with it or where is the document, etc.

There are some benefit by that

- easy to understand and find code
- easy to reflect App Bundle
- reducing build time
- separation of dependency

Now, I completed separation of 2 features. and progressing 1 more feature.

### Difficulties on refactoring

When I started to refactor, making base architecture was easy.  
You may think that just adding base architecture module, then it’s completed.

But, It was not that easy by the reason below

- Base classes has a lot of dependency with feature code  
    => I couldn’t separate all the code. so, I solved the problem by dependency injection. app module(which refer whole feature) inject the dependency, and feature module used the class.
- sometimes, feature module should start activity of different feature  
    => app module inject intent of activity, and feature module use it.
- Mock testing environment
- separation of strings.xml and translations. and resources.
- separation of commonly used classes(some classes depends on feature. I had to separate it)  
    => when separate the classes, don’t change package name if possible, then the referring file’s imports are not changed.
- error and bugs by changing Gradle scripts  
    - some library versions had to be changed. and compatibility and Proguard issues occurs.
- long gradle sync time by a lot of flavors, and long build time.

There were a lot of difficulty not to mention, sometimes give up, and come up with better approach and try again. try again. It was not easy. and there were no spare time, I think, except for sleeping little, I’d just worked. But, now it’s completed. and I’m free :)

---

As I mentioned above, the new architecture looks nice at first time, but whenever time flows without maintenance and improvement, It may be used wrong way in the future, or some function is lack. so, to review the code continuously and discuss and improve is important.

Any feedback will help me a lot.

Thanks,