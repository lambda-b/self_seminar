const badDeckPathPattern = /^\/self_seminar(?=\/|$)/;

type RouteLocation = {
  path: string;
  query: Record<string, unknown>;
  hash: string;
  params: Record<string, string | string[]>;
};

type RouteRedirect = {
  path: string;
  query: RouteLocation["query"];
  hash: string;
};

type RouteRecord = {
  path: string;
  redirect?: (to: RouteLocation) => RouteRedirect;
};

export default (routes: RouteRecord[]): RouteRecord[] => [
  {
    path: "/self_seminar/:pathMatch(.*)*",
    redirect: (to) => ({
      path: to.path.replace(badDeckPathPattern, "") || "/1",
      query: to.query,
      hash: to.hash,
    }),
  },
  {
    path: "/presenter/presenter/:no",
    redirect: (to) => ({
      path: `/presenter/${String(to.params.no)}`,
      query: to.query,
      hash: to.hash,
    }),
  },
  ...routes,
];
