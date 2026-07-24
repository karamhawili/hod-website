'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/admin/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {defineLocations, presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

export default defineConfig({
  basePath: '/admin',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({structure}),
    presentationTool({
      previewUrl: {
        initial: '/',
      },
      resolve: {
        locations: {
          project: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => {
              if (!doc?.slug) {
                return {
                  message: 'Add a slug to link this project to a page',
                  tone: 'caution',
                }
              }

              return {
                locations: [
                  {
                    title: doc.title || 'Project page',
                    href: `/project/${doc.slug}`,
                  },
                  {
                    title: 'Portfolio',
                    href: '/portfolio',
                  },
                ],
              }
            },
          }),
          category: defineLocations({
            select: {
              title: 'title',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title ? `Portfolio (${doc.title})` : 'Portfolio',
                  href: '/portfolio',
                },
              ],
            }),
          }),
        },
      },
    }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
