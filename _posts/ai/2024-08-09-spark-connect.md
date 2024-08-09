---
layout: post
title: "How to use Spark Connect on EMR from local"
date: 2024-08-09
categories: ai
---


# run connect server on EMR cluster
it's supported from 3.4.0
```shell
sudo /usr/lib/spark/sbin/start-connect-server.sh --packages org.apache.spark:spark-connect_2.12:{your-spark-version}
```

# configure local env
if the version is not compatible, the error can occur.
```shell
pip install pyspark==3.4.1
pip install grpcio-status==1.64.0
pip install grpcio==1.64.0
pip install protobuf==5.27.0
```

# access to spark connect from local

```shell
pyspark --remote "sc://{emr-cluster-master-ip}"
```


```python
from pyspark.sql import SparkSession

# Step 1: Create a Spark Session
spark = SparkSession.builder \
    .appName("Simple Spark Connect Example") \
    .remote("sc://{emr-cluster-master-ip}") \ 
    .getOrCreate()
```



# spark context
on spark connect, sparkContext is deprecated,
not sure how to use `spark.sparkContext.setCheckpointDir()`

and only single connect server can be running at the same time.
need to check how several users can use spark connect.


# Troubleshooting

pyspark.errors.exceptions.base.PySparkTypeError: [NOT_ITERABLE] Column is not iterable.

- if protobuf version is not compatible, the error can occur