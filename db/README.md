# Setup local DynamoDB instance
1. Download DynamoDB jar file.  Extract contents.
2. Open a new console tab.
3. Go to the folder:  `cd Applications/dynamodb_local_2016-05-17/`
4. Start up the DB instance: `java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb`
5. To view the DynamoDBLocal shell: http://localhost:8000/shell/
