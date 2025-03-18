# Jira MCP Server

![NPM Version](https://img.shields.io/npm/v/%40parassolanki%2Fjira-mcp-server) ![NPM Downloads](https://img.shields.io/npm/dw/%40parassolanki%2Fjira-mcp-server) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A [Model Context Protocol](https://github.com/modelcontextprotocol) Server for Jira.

Provides integration with Jira through MCP, allowing LLMs to interact with it.

[Jira REST Api Docs](https://developer.atlassian.com/server/jira/platform/rest)

## Installation

### Manual Installation

> Note: Requires Node version to be 22.12.0 or above

1. Create or get Jira Personal Access Token: [Guide](https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html)

2. Add server config to Claude Desktop:

   - MacOS: ~/Library/Application Support/Claude/claude_desktop_config.json
   - Windows: [Check this Guide](https://gist.github.com/feveromo/7a340d7795fca1ccd535a5802b976e1f)

```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["-y", "@parassolanki/jira-mcp-server@latest"],
      "env": {
        "JIRA_PERSONAL_ACCESS_TOKEN": "email@example.com:your_personal_jira_access_token",
        "JIRA_BASE_URL": "jira_base_url"
      }
    }
  }
}
```

For Windows:

```json
{
  "mcpServers": {
    "jira": {
      "command": "cmd /c npx",
      "args": ["-y", "@parassolanki/jira-mcp-server@latest"],
      "env": {
        "JIRA_PERSONAL_ACCESS_TOKEN": "email@example.com:your_personal_jira_access_token",
        "JIRA_BASE_URL": "jira_base_url"
      }
    }
  }
}
```

## Components

### Tools

1.  `list_projects`: List projects from Jira.

    - Required inputs:
      - `query` (optional string): A query string used to filter the returned projects.
      - `maxResults` (optional number, max: 100): The maximum number of results to return.
      - `expand` (optional string): Expand additional information in the response. (comma separated `description`, `lead`, `issueTypes`, `url`, `projectKeys`, `permissions` and `insight`).

2.  `list_boards`: List boards from a project.

    - Required inputs:
      - `projectKeyOrId` (string): Key or Id of the project.
      - `name` (optional string): Name of the project.
      - `maxResults` (optional number, max: 100): The maximum number of results to return.
      - `startAt` (optional number): The starting index of the returned boards.
      - `type` (optional string): The type of boards. (can be one of `scrum` or `kanban`).

3.  `list_sprints_from_board`: List sprints from a board.

    - Required inputs:
      - `boardId` (string): The ID of the board.
      - `maxResults` (optional number, max: 100): The maximum number of results to return.
      - `startAt` (optional number): The starting index of the returned boards.

4.  `list_issues_from_sprint`: List issues from a sprint.

    - Required inputs:
      - `boardId` (string): The ID of the board.
      - `sprintId` (string): The ID of the sprint.
      - `maxResults` (optional number, max: 100): The maximum number of results to return.
      - `startAt` (optional number): The starting index of the returned boards.
      - `expand` (optional string): Expand additional information in the response. (comma separated `operations`, `versionedRepresentations`, `editmeta`, `changelog` and `renderedFields`).

## Usage examples

Some example prompts you can use to interact with Jira:

1. "Show me all Jira projects" → execute the list_projects tool to see all available projects.
2. "What Kanban boards exist in the DEV project?" → execute the list_boards tool with the DEV project key and type parameter set to "kanban".
3. "Show me all the sprints for board ID 123" → execute the list_sprints_from_board tool to see all sprints associated with board 123.
4. "What issues are in sprint 456 on board 123?" → execute the list_issues_from_sprint tool to see all issues in sprint 456 on board 123.
5. "Show me the first 50 issues from the current sprint on the Marketing board" → first execute list_boards to find the Marketing board ID, then list_sprints_from_board to find the current sprint, then list_issues_from_sprint with maxResults=50.

## Development

1. Install dependencies:

```shell
pnpm install
```

2. Configure Github Access token in `.env`:

```shell
JIRA_PERSONAL_ACCESS_TOKEN=email@example.com:your_personal_jira_access_token
JIRA_BASE_URL=jira_base_url
```

3. Run locally with watch:

```shell
pnpm dev
```

4. Build the server:

```shell
pnpm build
```

5. Local debugging with inspector:

```shell
pnpm inspector
```
