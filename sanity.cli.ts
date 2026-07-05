/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export default defineCliConfig({
  api: { projectId, dataset },
  typegen: {
    // Where GROQ queries (defineQuery) live, to generate result types from.
    path: './src/**/*.{ts,tsx}',
    // Extracted schema JSON — must match the --path used by the `typegen`
    // script's `sanity schema extract` step in package.json.
    schema: './src/sanity/extract.json',
    // Generated output. Committed to git; picked up via tsconfig `**/*.ts`.
    generates: './src/sanity/sanity.types.ts',
    // Keep OFF while hand-written @/types/sanity is still consumed by the
    // (out-of-scope) PageBuilder/project pages. `true` retypes every existing
    // sanityFetch() to generated types, which conflicts with those hand-written
    // types and breaks `next build`. Generated *_QUERY_RESULT types are still
    // available for opt-in import. Flip to `true` once all consumers use them.
    overloadClientMethods: false,
  },
})
