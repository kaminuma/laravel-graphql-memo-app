import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: {
    "http://backend:8000/graphql": {
      headers: {
        Accept: "application/json",
      },
    },
  },
  documents: [
    "./src/**/*.graphql",
    "./src/services/**/*.ts",
    "./src/features/**/graphql/**/*.graphql",
  ],
  generates: {
    "src/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
        skipTypename: false,
        documentMode: "documentNode",
        dedupeFragments: true,
      },
    },
  },
};

export default config;
