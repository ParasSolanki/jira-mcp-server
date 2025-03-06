import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,

  clientPrefix: "PUBLIC_",

  client: {},

  shared: {
    NODE_ENV: z.enum(["development", "production"]),
  },

  server: {
    JIRA_BASE_URL: z
      .string({
        required_error: "JIRA_BASE_URL is required",
      })
      .min(1, "JIRA_BASE_URL is required"),
    JIRA_PERSONAL_ACCESS_TOKEN: z
      .string({
        required_error: "JIRA_PERSONAL_ACCESS_TOKEN is required",
      })
      .min(1, "JIRA_PERSONAL_ACCESS_TOKEN is required"),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    JIRA_BASE_URL: process.env.JIRA_BASE_URL,
    JIRA_PERSONAL_ACCESS_TOKEN: process.env.JIRA_PERSONAL_ACCESS_TOKEN,
  },
});
