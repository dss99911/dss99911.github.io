---
layout: post
title: "Simple Android Architecture : Testing efficiently with Android X"
date: 2023-12-25 01:05:37 +0900
categories: [mobile, android]
tags: [android, testing, unit-test, androidx, tdd]
---
This is one of [series of Simple Android Architecture](https://github.com/dss99911/kotlin-simple-architecture/tree/android-architecture). and you can check sample code there.

## Index

- Merit and Demerit of testing
- Requirement for testing
- How to achieve the requirements
- How to test
- Thinking about TDD
- Thinking about whole testing of client and server

# Merit and Demerit of testing

When I develop android application, I felt skeptical about testing by the reason below

- It’s simpler to test by running application.
- android test is difficult and taking time comparing to importance.
- QA team test and find bug, developers fix bug. There was not much need to test deeply by developer.
- It’s more important to learn other technology comparing to testing
- Design easily changed, we don’t have time to maintain testing code.

But, I felt the necessity below as well

- I developed and tested the code  
    => found a bug and fixed  
    => I can’t ensure the changed code is fine.  
    => choose one of the below  
    1. To test all manually again  
    2. To believe QA find bug if exists  
    3. To pray no issue occurs.
- I completed and tested the code  
    => code looks not good, want to refactor  
    => I worry bug occurs by the refactoring  
    => choose one of the below  
    1. To refactor and test all again and take a lot of time.  
    2. Not to refactor and make spaghetti code which difficult to maintain.
- The time to build apk get longger whenever app get bigger. so, manual testing time increase as well
- in some feature, it was difficult to make testing environment. in this case, I had to modify the code to test and rollback after test completed.

# Requirement for testing

Well, I showed the merit and demerit of testing.

But, still I can’t feel testing is required.

So, I decided that if some condition below is satisfied, I will do testing.

1. Whenever writing test case, It’s not easy to make mock. mock code should be minimized.
2. The mock code should be able to be used on manual testing as well
3. Reduce duplicate and boiler plate code of product as much as possible. in order to reduce test code for duplicate and boiler plate code as well.
4. Writing test code should be easy. even novice also should test easily without deep technical understanding. in order for all developers in company to test without much knowledge

# How to achieve the requirements

Then, Let’s see how to achieve the requirement above.

## Whenever writing test case, It’s not easy to make mock. mock code should be minimized.

Let’s think about mock. why do we need mock?  
Let’s say A class refer to B class.  
If we test A class, B class may not work properly. so, for testing A, it’s ideal to remove dependency to B by mocking and test A only.

But, There are several components. api, database, repository, use-case, ViewModel, Fragment, Activity.

A lot of mock codes are required for each components to separate each others.

To remove dependency is good. but there is possibility that the mock code also not correct.

Then, how about not using mock and just refers to B class?  
I think it’s fine if B class is already tested.

But, some classes need mock. when we test A class, if we can’t control B class.  
if B class has b() function. and it can returns 1, 2, 3. but if we can’t make the b() to return all of 1, 2, 3, we need mock to test all return cases

**Mock required Examples**

- If the api is not prepared yet, we need the mock to test.
- If the application we develop is a simple todo app, we can add and delete task, and set the task completed or active. in this case, we don’t need mock.
- But, if it’s loan application to lend money. It depends on server status like the loan application is approved or not, the disbursal is completed or not. about disbursal, we can wait until it’s completed. but loan application is related to user’s credit, and we can’t make mock of user’s credit. if dev server provide the api which control user’s credit, we can test it without the mock.

Whether we can control the api return or not. we can’t ensure that the api always stable. and, also it’s slow.

So, we need api mock.  
But, other components don’t need mock as we can control it(if it’s database, we can control by inserting and deleting)

you can check the mock example [here](https://github.com/dss99911/simple-android-architecture/blob/711a705fb1c19f7c01908a8887674db0758cbb6c/sample-testing-codelab/src/mock/java/com/example/android/architecture/blueprints/todoapp/data/source/remote/MockTaskApi.kt). normally it’s called ‘fake’ instead of ‘mock’. [the difference of ‘fake’ and ‘mock’](https://www.martinfowler.com/articles/mocksArentStubs.html)

Well, now I minimized the mock code to just api.

## The mock code should be able to be used on manual testing

for testing, only api mock is required.

It means that, if there is api mock, we can run application with the mock. and can test manually as well. so that, even if we are not familiar with making testing code, or not sure if testing code is correct. we can test manually.

Normally, when we test with mock data, we modify the code. and after test, we rollback the code.

Think about mock api. it’s similar to dev api. so, we can consider mock api is one of testing server.

So, If you have staging flavor of Dev, and Prod. just add Mock flavor.

and add your mock api class on mock flavor, inject the mock api.  
now, you don’t need to rollback the code. and whenever you want to test with the mock api. just change the flavor to Mock and test.

## Reduce duplicate and boiler plate code as much as possible. in order to reduce test code for duplicate and boiler plate code as well.

There are articles and samples [here](https://github.com/dss99911/simple-android-architecture#articles). you can see how to reduce boilerplate. so that, able to test on business logic only.

## Writing test code should be easy. even novice also easily test without deep technical understanding.

I wrote base testing code for testing easily.  
You can check how to use it by the sample

- [Fragment test](https://github.com/dss99911/simple-android-architecture/blob/0632fac7645cecac521d732f44ae1ae0d63534b3/sample-testing-codelab/src/androidTest/java/com/example/android/architecture/blueprints/todoapp/tasks/TasksFragmentTest.kt) : You can see that companion object’s function is used by fragment test and activity test both. so, ActivityTest doesn’t need to know each Fragment’s view’s id or text. just use Fragment’s test function.
- [Activity integration test](https://github.com/dss99911/simple-android-architecture/blob/6e2b09c422b3afade0bfc27941011b10d04a0bd3/sample-testing-codelab/src/androidTest/java/com/example/android/architecture/blueprints/todoapp/TasksActivityTest.kt)
- [ViewModel test](https://github.com/dss99911/simple-android-architecture/blob/40f2a9e9b28827ab8b0314414ca10cb308373e1e/sample-testing-codelab/src/test/java/com/example/android/architecture/blueprints/todoapp/tasks/TasksViewModelTest.kt)
- [Api test](https://github.com/dss99911/simple-android-architecture/blob/574c3763972bc7b639e9f99a48ad8965d4c04f68/sample-testing-codelab/src/test/java/com/example/android/architecture/blueprints/todoapp/data/source/remote/TaskApiTest.kt)
- [Database test](https://github.com/dss99911/simple-android-architecture/blob/e1282e473373eb91e738306d273fa48593a86b8a/sample-testing-codelab/src/test/java/com/example/android/architecture/blueprints/todoapp/data/source/local/TasksDaoTest.kt)

# How to test

If you want to learn how to test with Android X

I recommend the code lab below. all my idea comes from/after these.

[Android code lab : Testing basics](https://codelabs.developers.google.com/codelabs/advanced-android-kotlin-training-testing-basics/#0)

[Android code lab : Testing Advanced](https://codelabs.developers.google.com/codelabs/advanced-android-kotlin-training-testing-test-doubles/index.html?index=..%2F..advanced-android-kotlin-training#0)

[Android code lab : Testing Advanced 2](https://codelabs.developers.google.com/codelabs/advanced-android-kotlin-training-testing-test-doubles/#0)

Additionally, I would like to explain how to test each component.

**Api**

- Test mock api class is working fine.
- If you can control api returns on dev or prod server. you can test on that server as well.

**ViewModel**

- Every function has input and output.
- But, in ViewModel, input and output is not clear comparing to function
- So, It’s important to make input and output clear.
- Input is event.  
    - user action. ex) click  
    - page event. ex) init, onStart, onActivityResult.
- Output is _value_ of Livedata.
- So, we have to make test case by each event. and assert result with Livedata.

**Fragment**

- Input is same with ViewModel’s output(LiveData)
- Output is ui, or ui action like navigation or showing dialog, snackbar
- we don’t mock input, so, need to make each case of input. and assert output.

**Activity**

- ViewModel, and Fragment test was just unit test to test whole case including exceptional case
- with Activity, we test all of use cases

You can run sample application and run testing code [here](https://github.com/dss99911/kotlin-simple-architecture/tree/android-architecture/sample-testing-codelab)

# Thinking about TDD

When I try to apply TDD on real project,

The biggest difficulty was that the design is not fixed and changed continuously even near the release date. and sometimes base structure was needed to change.

so, It was not good to add testing code before coding, in case design is not fixed.

I think the purpose of TDD is to list up the test cases and edge cases on the step of structure designing.

When you design structure, you’ll consider various cases. and decide the structure and start to write code.

But, whenever time flows. you’ll forget the various cases. and just focusing on ideal case only.

So, It’s important to list up the all the cases(including edge case) in document. and when writing code and test, consider that.

But, if you list up the all the cases in test class, instead of in document.  
It doesn’t require document. and test class is for listing up all the cases.

so, It’s TDD. that thinking about all the cases. and list up on the test class.  
Then, which one to write first between code and test code, is not matter in my thinking.

# Thinking about whole testing of client and server

I mentioned on the above that If dev server provide test api which control some condition. we don’t need mock class.

But, there are more benefit from the test api.

- whole integration testing available including client and server.  
    Whenever, server or client is changed, we can run the client testing code with dev server. and verify that it’s working fine in all the use cases.
- Manual testing, and QA testing also requires the function to control some condition to test all the cases. normally CMS website provide that function. so, it seems good that service api’s dev server provide test api, and both CMS dev web site, and app use the test api to control the condition.

so that, QA and testing code can verify all the test cases easily.

You can check code on [this repository](https://github.com/dss99911/kotlin-simple-architecture/tree/android-architecture)