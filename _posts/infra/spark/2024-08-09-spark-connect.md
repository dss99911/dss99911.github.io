---
layout: post
title: "How to Use Spark Connect on EMR from Local Environment"
date: 2024-08-09
categories: [infra, spark]
description: "Step-by-step guide to setting up Spark Connect on AWS EMR and connecting from your local development environment. Includes version compatibility, troubleshooting, and limitations."
tags: [Spark, Spark Connect, EMR, AWS, PySpark, Remote Development]
---

Spark Connect allows you to run Spark jobs remotely, enabling local development against an EMR cluster. This guide covers setup, configuration, and common issues.

## Prerequisites

- AWS EMR cluster with Spark 3.4.0 or later
- SSH access to EMR master node
- Python environment on your local machine
- Network access to EMR cluster (VPN or direct)

## Reference

[Spark Connect Official Documentation](https://spark.apache.org/docs/latest/spark-connect-overview.html)

## Setting Up Spark Connect Server on EMR

Spark Connect is supported from version 3.4.0. Start the connect server on your EMR master node:

```shell
sudo /usr/lib/spark/sbin/start-connect-server.sh --packages org.apache.spark:spark-connect_2.12:{your-spark-version}
```

**Note**: Replace `{your-spark-version}` with your actual Spark version (e.g., `3.4.1`).

## Configuring Local Environment

Version compatibility is critical. Mismatched versions will cause errors.

```shell
pip install pyspark==3.4.1
pip install grpcio-status==1.64.0
pip install grpcio==1.64.0
pip install protobuf==5.27.0
```

## Connecting to Spark Connect

### Using PySpark Shell

```shell
pyspark --remote "sc://{emr-cluster-master-ip}"
```

### Using Python Script

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("Spark Connect Example") \
    .remote("sc://{emr-cluster-master-ip}") \
    .getOrCreate()

# Now you can use spark as usual
df = spark.createDataFrame([("Alice", 1), ("Bob", 2)], ["name", "id"])
df.show()
```

## SparkContext Limitations

In Spark Connect, `SparkContext` is deprecated. The following functions are not available:

| Function | Status | Alternative |
|----------|--------|-------------|
| `sc.setCheckpointDir` | Deprecated | Use `spark.sparkContext.setCheckpointDir()` on server |
| `sc.addPyFile` | Deprecated | Pre-install packages on cluster |
| `sc.install_pypi_package` | Deprecated | Pre-install packages on cluster |
| `sc.parallelize` | Deprecated | Use `spark.createDataFrame()` |
| `sc.setLogLevel` | Deprecated | Configure on server side |
| `sc.broadcast` | Deprecated | Use DataFrame operations |

**Important**: Only a single connect server can run at a time on the cluster.

## Troubleshooting

### Error: [NOT_ITERABLE] Column is not iterable

```
pyspark.errors.exceptions.base.PySparkTypeError: [NOT_ITERABLE] Column is not iterable.
```

**Cause**: Protobuf version incompatibility

**Solution**: Ensure protobuf version matches the server:
```shell
pip install protobuf==5.27.0
```

### Connection Refused

**Cause**: Firewall or security group blocking port 15002

**Solution**:
1. Add inbound rule for port 15002 in EMR security group
2. Or use SSH tunnel:
```shell
ssh -L 15002:localhost:15002 hadoop@{emr-master-ip}
```

### Version Mismatch Errors

**Cause**: Local PySpark version doesn't match EMR Spark version

**Solution**: Install the exact same version:
```shell
# Check EMR Spark version
spark-submit --version

# Install matching local version
pip install pyspark=={same-version}
```

## Best Practices

1. **Use virtual environments**: Isolate Spark Connect dependencies
2. **Match versions exactly**: Minor version differences can cause issues
3. **Use SSH tunneling**: More secure than opening ports
4. **Monitor server resources**: Connect server adds overhead to master node