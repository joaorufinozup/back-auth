import express from 'express';
import cors from 'cors';
import AWS from 'aws-sdk';

const app = express();

app.use(express.json());
app.use(cors());

const docClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localhost:8000',
  region: 'local',
});

app.post('/', (req, res) => {
  const { accessToken, refreshToken, code } = req.body;
  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: 'Tokens',
    Item: {
      code,
      accessToken,
      refreshToken,
      ttl: '1231231',
    },
  };

  docClient.put(params, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(err.statusCode ? err.statusCode : 500).send(err);
    }

    console.log('Added item', data);
    res.send(data);
  });
});

app.get('/', (req, res) => {
  const { code: codeQuery } = req.query;

  if (!codeQuery) res.sendStatus(400);

  const code = codeQuery as string;

  const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: 'Tokens',
    Key: {
      code,
    },
  };

  docClient.get(params, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(err.statusCode ? err.statusCode : 500).send(err);
    }

    console.log(data);
    res.send(data);
  });
});

app.put('/:code', (req, res) => {
  const { refreshToken } = req.body;
  const { code } = req.params;

  const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: 'Tokens',
    Key: {
      code,
    },
    UpdateExpression: 'set refreshToken = :rt',
    ExpressionAttributeValues: {
      ':rt': refreshToken,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  docClient.update(params, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(err.statusCode ? err.statusCode : 500).send(err);
    }

    console.log(data);
    res.send(data);
  });
});

app.get('/all', (req, res) => {
  const params: AWS.DynamoDB.DocumentClient.ScanInput = {
    TableName: 'Tokens',
    Select: 'ALL_ATTRIBUTES',
  };

  docClient.scan(params, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }

    console.log('Items', data);
    res.send(data);
  });
});

app.listen(3000, () => {
  console.log('App started on port 3000');
});
