import { slides } from "#slidev/slides";

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
  name?: string;
  path: string;
  redirect?: (to: RouteLocation) => RouteRedirect;
  beforeEnter?: (to: RouteLocation) => true | RouteRedirect;
};

const notFoundRouteName = "NotFound";
const playRouteName = "play";

const isKnownSlidePath = (value: string | string[]) => {
  const path = Array.isArray(value) ? value[0] : value;

  return slides.value.some(
    (slide) => String(slide.no) === path || slide.meta.slide?.frontmatter.routeAlias === path,
  );
};

export default (routes: RouteRecord[]): RouteRecord[] => {
  const knownRoutes = routes
    .filter((route) => route.name !== notFoundRouteName)
    .map((route) => {
      if (route.name !== playRouteName) {
        return route;
      }

      return {
        ...route,
        beforeEnter: (to: RouteLocation) =>
          isKnownSlidePath(to.params.no)
            ? true
            : {
                path: "/1",
                query: to.query,
                hash: to.hash,
              },
      };
    });

  return [
    {
      path: "/presenter/presenter/:no",
      redirect: (to) => ({
        path: `/presenter/${String(to.params.no)}`,
        query: to.query,
        hash: to.hash,
      }),
    },
    ...knownRoutes,
    {
      path: "/:pathMatch(.*)*",
      redirect: (to) => ({
        path: "/1",
        query: to.query,
        hash: to.hash,
      }),
    },
  ];
};
