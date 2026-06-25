import type { Config } from "@react-router/dev/config";

export default {
  // SPA mode: the admin panel authenticates with a localStorage bearer token and
  // calls the unigreen_be backend directly from the client, so there is no SSR.
  ssr: false,
} satisfies Config;
