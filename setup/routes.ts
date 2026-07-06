const badDeckPathPattern = /^\/self_seminar(?=\/|$)/;

export default (routes) => [
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
      path: `/presenter/${to.params.no}`,
      query: to.query,
      hash: to.hash,
    }),
  },
  ...routes,
];
