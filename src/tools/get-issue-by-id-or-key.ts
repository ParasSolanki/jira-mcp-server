import { z } from "zod";
import { $jiraJson } from "../utils/jira-fetch.js";
import { err, ok } from "neverthrow";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { env } from "../env.js";
import { issueSchema } from "../common/schema.js";

// @see https://developer.atlassian.com/server/jira/platform/rest/v10004/api-group-board/#api-agile-1-0-board-boardid-sprint-sprintid-issue-get

const getIssueByIdOrKeySchema = z.object({
  maxResults: z.number().optional(),
  startAt: z.number().optional(),
  expand: z.string().optional(),
  total: z.number().optional(),
  issues: z.array(issueSchema),
});

export const getIssueByIdOrKeyInputSchema = z.object({
  issueIdOrKey: z.string().describe("The ID or key of the issue"),
  expand: z
    .string()
    .optional()
    .describe(
      "Use this parameter to include additional information in the response. This parameter accepts a comma-separated list. Expand options include: `schema` and `names`. Comma separated list of options.",
    ),
});

export const GET_ISSUE_BY_ID_OR_KEY_TOOL: Tool = {
  name: "get_issue_by_id_or_key",
  description: "Get an issue by ID or key",
  inputSchema: zodToJsonSchema(
    getIssueByIdOrKeyInputSchema,
  ) as Tool["inputSchema"],
};

export type GetIssueByIdOrKeyInput = z.output<
  typeof getIssueByIdOrKeyInputSchema
>;

export async function getIssueByIdOrKey(input: GetIssueByIdOrKeyInput) {
  const url = new URL(
    `/rest/api/2/issue/${input.issueIdOrKey}`,
    env.JIRA_BASE_URL,
  );

  if (input.expand) url.searchParams.set("expand", input.expand);

  const json = await $jiraJson(url.toString());

  if (json.isErr()) {
    console.error(json.error.message);
    return err(json.error);
  }

  const result = getIssueByIdOrKeySchema.safeParse(json.value);

  if (!result.success) {
    return err(new Error("Invalid response from Jira"));
  }

  return ok(result.data);
}
