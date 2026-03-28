import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("upload", "routes/upload.tsx"),
  route("auth", "routes/auth.tsx"),
  route("responses", "routes/responses.tsx"),
] satisfies RouteConfig;
