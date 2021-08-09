FROM jupyter/all-spark-notebook:spark-3.1.1

USER root

ENV HADOOP_VERSION=3.2.0
ENV AWS_SDK_VERSION=1.11.874

RUN wget https://repo1.maven.org/maven2/org/apache/hadoop/hadoop-aws/${HADOOP_VERSION}/hadoop-aws-${HADOOP_VERSION}.jar -P $SPARK_HOME/jars/
RUN wget https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-bundle/${AWS_SDK_VERSION}/aws-java-sdk-bundle-${AWS_SDK_VERSION}.jar -P $SPARK_HOME/jars/

USER $NB_USER

RUN pip install boto3