#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  LIST_ISSUES_FROM_SPRINT_TOOL,
  listIssuesFromSprint,
  listIssuesFromSprintInputSchema,
} from "./tools/list-issues-from-sprint.ts";
import { VERSION } from "./constants.js";
import {
  LIST_PROJECTS_TOOL,
  listProjects,
  listProjectsInputSchema,
} from "./tools/list_projects.js";
import { LIST_BOARDS_TOOL, listBoards } from "./tools/list_boards.js";
import { listBoardsInputSchema } from "./tools/list_boards.js";
import {
  LIST_SPRINTS_FROM_BOARD_TOOL,
  listSprintsFromBoard,
  listSprintsFromBoardInputSchema,
} from "./tools/list-sprints-from-board.js";
import {
  CREATE_ISSUE_TOOL,
  createIssue,
  createIssueInputSchema,
} from "./tools/create-issue.js";

const server = new Server(
  { name: "Jira MCP Server", version: VERSION },
  { capabilities: { tools: {} } },
);

export const tools = [
  // list
  LIST_PROJECTS_TOOL,
  LIST_BOARDS_TOOL,
  LIST_SPRINTS_FROM_BOARD_TOOL,
  LIST_ISSUES_FROM_SPRINT_TOOL,

  // create
  CREATE_ISSUE_TOOL,
] satisfies Tool[];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const name = request.params.name;
    const args = request.params.arguments;

    if (!args) throw new Error("No arguments provided");

    if (name === LIST_ISSUES_FROM_SPRINT_TOOL.name) {
      const input = listIssuesFromSprintInputSchema.safeParse(args);

      if (!input.success) {
        return {
          isError: true,
          content: [{ type: "text", text: "Invalid input" }],
        };
      }

      const result = await listIssuesFromSprint(input.data);

      if (result.isErr()) {
        console.error(result.error.message);
        return {
          isError: true,
          content: [{ type: "text", text: "An error occurred" }],
        };
      }

      return {
        content: [
          { type: "text", text: JSON.stringify(result.value, null, 2) },
        ],
      };
    }

    if (name === LIST_PROJECTS_TOOL.name) {
      const input = listProjectsInputSchema.safeParse(args);

      if (!input.success) {
        return {
          isError: true,
          content: [{ type: "text", text: "Invalid input" }],
        };
      }

      const result = await listProjects(input.data);

      if (result.isErr()) {
        console.error(result.error.message);
        return {
          isError: true,
          content: [{ type: "text", text: "An error occurred" }],
        };
      }

      return {
        content: [
          { type: "text", text: JSON.stringify(result.value, null, 2) },
        ],
      };
    }

    if (name === LIST_BOARDS_TOOL.name) {
      const input = listBoardsInputSchema.safeParse(args);

      if (!input.success) {
        return {
          isError: true,
          content: [{ type: "text", text: "Invalid input" }],
        };
      }

      const result = await listBoards(input.data);

      if (result.isErr()) {
        console.error(result.error.message);
        return {
          isError: true,
          content: [{ type: "text", text: "An error occurred" }],
        };
      }

      return {
        content: [
          { type: "text", text: JSON.stringify(result.value, null, 2) },
        ],
      };
    }

    if (name === LIST_SPRINTS_FROM_BOARD_TOOL.name) {
      const input = listSprintsFromBoardInputSchema.safeParse(args);

      if (!input.success) {
        return {
          isError: true,
          content: [{ type: "text", text: "Invalid input" }],
        };
      }

      const result = await listSprintsFromBoard(input.data);

      if (result.isErr()) {
        console.error(result.error.message);
        return {
          isError: true,
          content: [{ type: "text", text: "An error occurred" }],
        };
      }

      return {
        content: [
          { type: "text", text: JSON.stringify(result.value, null, 2) },
        ],
      };
    }

    if (name === CREATE_ISSUE_TOOL.name) {
      const input = createIssueInputSchema.safeParse(args);

      if (!input.success) {
        return {
          isError: true,
          content: [{ type: "text", text: "Invalid input" }],
        };
      }

      const result = await createIssue(input.data);

      if (result.isErr()) {
        console.error(result.error.message);
        return {
          isError: true,
          content: [{ type: "text", text: "An error occurred" }],
        };
      }

      return {
        content: [
          { type: "text", text: JSON.stringify(result.value, null, 2) },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: "An error occurred" }],
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error("JIRA MCP Server is running");
}

run().catch((error) => {
  console.error("Fatal error in run()", error);
  process.exit(1);
});
