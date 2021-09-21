import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB({
  endpoint: 'http://localhost:8000',
  region: 'local',
});

const tableSchema: AWS.DynamoDB.DeleteTableInput = {
  TableName: 'Tokens',
};

dynamodb.deleteTable(tableSchema, (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Deleted table', data);
});
