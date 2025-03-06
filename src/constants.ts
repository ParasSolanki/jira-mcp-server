import { getUserAgent } from "universal-user-agent";
import pkg from "../package.json" with { type: "json" };

export const VERSION = pkg.version;
export const USER_AGENT = `modelcontextprotocol/servers/jira/v${VERSION} ${getUserAgent()}`;
