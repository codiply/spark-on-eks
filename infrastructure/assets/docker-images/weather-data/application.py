import os
import boto3
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, avg, to_timestamp, year
from pyspark.sql.types import StructType, StructField, StringType, FloatType

bucket = os.environ['S3_BUCKET']

caller_identity = boto3.client('sts').get_caller_identity()
print("Caller identity:")
print(caller_identity)
print("")

if __name__ == "__main__":  
    session = boto3.Session()
    credentials = session.get_credentials().get_frozen_credentials()

    spark = SparkSession\
          .builder\
          .appName("WeatherData")\
          .getOrCreate()
          
    schema = StructType([
        StructField("station_id", StringType(), False),
        StructField("date", StringType(), False),
        StructField("element", StringType(), False),
        StructField("value", FloatType(), False),
        StructField("m_flag", StringType(), True),
        StructField("q_flag", StringType(), True),
        StructField("s_flag", StringType(), True),
        StructField("obs_time", StringType(), True)
    ])

    df = spark.read.csv("s3a://{}/weather/".format(bucket), header=False, schema=schema)
    
    df_tavg = df.filter(col("element") == "TAVG")\
        .withColumn("year", year(to_timestamp("date", 'yyyyMMdd')))\
        .groupBy("station_id", "year")\
        .agg(avg("value").alias("tavg"))\
        .cache()

    df_tavg.write.json("s3a://{}/weather-tavg/".format(bucket), mode="overwrite")

    spark.stop()