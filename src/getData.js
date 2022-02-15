const execute = require("./execute");
module.exports.handler = async (event) => {
  //Getting path params
  const pathParams = event.pathParameters;
  console.log("Paramtery", pathParams);

  const res = await execute(pathParams);
  if (res.length !== 0) {
    return {
      statusCode: 200,
      body: JSON.stringify(res),
    };
  } else {
    return {
      statusCode: 204,
      body: JSON.stringify("NO DATA WAS FOUND"),
    };
  }
};
