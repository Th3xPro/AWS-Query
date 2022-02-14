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
      KeyConditionExpression: "#City = :pkey",
      ExpressionAttributeValues: {
        ":pkey": data.city,
      },
      ExpressionAttributeNames: {
        "#City": "City",
      },
      ScanIndexForward: true,
    };
  } else {
    return {
      TableName: TABLE_NAME,
      KeyConditionExpression: "#City = :pkey and begins_with(#Details, :skey)",
      ExpressionAttributeValues: {
        ":pkey": data.city,
        ":skey": sortKey,
      },
      ExpressionAttributeNames: {
        "#City": "City",
        "#Details": "district#street#zip",
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
