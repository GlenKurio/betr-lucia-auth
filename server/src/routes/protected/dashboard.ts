import Elysia from "elysia";

const dashboard = new Elysia().get("/dashboard", () => {
  return { message: "Dashboard" };
});

export { dashboard };
