import { AppSyncResolverHandler } from "aws-lambda";
import * as t from "../generated-types";
import { TableName, db } from "./common";

export const handler: AppSyncResolverHandler<
  t.MutationCreateNoteArgs,
  t.Query["note"]
> = async ({ arguments: { in: Item } }) => {
  await db
    .put({
      TableName,
      Item,
    })
    .promise();
  return Item;
};
