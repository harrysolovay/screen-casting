import { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  return {
    body: `Hello world! The current path is "${event.path}"`,
    headers: {
      "Content-Type": "text/plain",
    },
    statusCode: 200,
  };
};
