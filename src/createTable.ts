import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB({
  endpoint: 'http://localhost:8000',
  region: 'local',
});

const tableSchema: AWS.DynamoDB.CreateTableInput = {
  TableName: 'Tokens',
  KeySchema: [{ AttributeName: 'code', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'code', AttributeType: 'S' }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
};

dynamodb.createTable(tableSchema, (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Created table', data);
});
