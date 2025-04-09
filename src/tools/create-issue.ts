import { z } from "zod";
import { $jiraJson } from "../utils/jira-fetch.ts";
import { err, ok } from "neverthrow";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { env } from "../env.js";

// @see https://developer.atlassian.com/server/jira/platform/rest/v10004/api-group-issue/#api-api-2-issue-post
// @see https://confluence.atlassian.com/adminjiraserver/issue-fields-and-statuses-938847116.html

const ISSUE_TYPES = {
  TASK: "Task",
  SUB_TASK: "Sub-task",
  STORY: "Story",
  EPIC: "Epic",
  BUG: "Bug",
};

export const createIssueInputSchema = z.object({
  projectKeyOrId: z.string().describe("The key or ID of the project"),
  summary: z.string().describe("The summary of the issue"),
  description: z.string().describe("The description of the issue"),
});

export const CREATE_ISSUE_TOOL: Tool = {
  name: "create_issue",
  description: "Create an issue in Jira",
  inputSchema: zodToJsonSchema(createIssueInputSchema) as Tool["inputSchema"],
};

export type CreateIssueInput = z.output<typeof createIssueInputSchema>;

export async function createIssue(input: CreateIssueInput) {
  const url = new URL(`/rest/api/2/issue`, env.JIRA_BASE_URL);

  const payload = {
    fields: {
      project: { key: input.projectKeyOrId },
      issuetype: { name: ISSUE_TYPES.TASK },
      summary: input.summary,
      description: input.description,
    },
  };

  const json = await $jiraJson(url.toString(), {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (json.isErr()) return err(json.error);

  return ok(json.value);
}
