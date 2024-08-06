import { treaty } from "@elysiajs/eden";
import type { App } from "../../../server/src/index";
export const app = treaty<App>(window.location.origin, {});
