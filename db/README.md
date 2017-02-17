# Setup local DynamoDB instance
1. Download DynamoDB jar file.  Extract contents.
2. Open a new console tab.
3. Go to the folder:  `cd Applications/dynamodb_local_2016-05-17/`
4. Start up the DB instance: `java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb`
5. To view the DynamoDBLocal shell: http://localhost:8000/shell/

# Example: Import data into AWS via CLI
These steps assume you have set up the AWS CLI.

1. `cd db/table-examples`
2. Run the following - `aws dynamodb batch-write-item --request-items file://recipe.json`
- Note: You can have a max of 25 requests per batch-write-item file.

## Resources
Data Types:  http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBMapper.DataTypes.html
Using the CLI: http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Tools.CLI.html
