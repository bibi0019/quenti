import { connect } from "@tidbcloud/serverless";
import { drizzle } from "drizzle-orm/tidb-serverless";

import { env } from "@quenti/env/server";

import * as schema from "./schema";

export * from "drizzle-orm";

const connection = env.TIDB
  ? connect({
      url: env.DATABASE_URL,
    })
  : null;

export const db = connection ? drizzle(connection, { schema }) : null;
