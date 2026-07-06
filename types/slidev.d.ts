declare module "#slidev/slides" {
  export const slides: {
    value: Array<{
      no: number;
      meta: {
        slide?: {
          frontmatter: {
            routeAlias?: string;
          };
        };
      };
    }>;
  };
}
