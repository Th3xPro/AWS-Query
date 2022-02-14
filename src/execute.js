const TABLE_NAME = process.env.cityTable;
const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
function createSortKey(data) {
  switch (Object.keys(data).length) {
    case 1:
      return "";
    case 2:
      return `${data.district}`;
    case 3:
      return `${data.district}#${data.street}`;
    case 4:
      return `${data.district}#${data.street}#${data.zip}`;
  }
}
function createParams(data, sortKey) {
  if (sortKey === "") {
    return {
      TableName: TABLE_NAME,
      KeyConditionExpression: "#PK = :pkey",
      ExpressionAttributeValues: {
        ":pkey": data.city,
      },
      ExpressionAttributeNames: {
        "#PK": "City",
      },
      ScanIndexForward: true,
    };
  } else {
    return {
      TableName: TABLE_NAME,
      KeyConditionExpression: "#PK = :pkey and begins_with(#SK, :skey)",
      ExpressionAttributeValues: {
        ":pkey": data.city,
        ":skey": sortKey,
      },
      ExpressionAttributeNames: {
        "#PK": "City",
        "#SK": "district#street#zip",
      },
      ScanIndexForward: true,
    };
  }
}
const execute = async (data) => {
  try {
    const sortKey = createSortKey(data);
    console.log("SORT KEY", sortKey);

    const params = createParams(data, sortKey);
    console.log("PARAMS", params);

    const result = await dynamoDB.query(params).promise();
    console.log(result);

    return result.Items;
  } catch (error) {
    console.log(error);
  }
};
module.exports = execute;
