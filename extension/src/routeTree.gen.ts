/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './pages/popup/routes/__root'
import { Route as IndexImport } from './pages/popup/routes/index'
import { Route as JobsIndexImport } from './pages/popup/routes/jobs/index'

// Create Virtual Routes

const JobsAddLazyImport = createFileRoute('/jobs/add')()
const JobsJobIdLazyImport = createFileRoute('/jobs/$jobId')()

// Create/Update Routes

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const JobsIndexRoute = JobsIndexImport.update({
  path: '/jobs/',
  getParentRoute: () => rootRoute,
} as any)

const JobsAddLazyRoute = JobsAddLazyImport.update({
  path: '/jobs/add',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./pages/popup/routes/jobs/add.lazy').then((d) => d.Route),
)

const JobsJobIdLazyRoute = JobsJobIdLazyImport.update({
  path: '/jobs/$jobId',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./pages/popup/routes/jobs/$jobId.lazy').then((d) => d.Route),
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/jobs/$jobId': {
      preLoaderRoute: typeof JobsJobIdLazyImport
      parentRoute: typeof rootRoute
    }
    '/jobs/add': {
      preLoaderRoute: typeof JobsAddLazyImport
      parentRoute: typeof rootRoute
    }
    '/jobs/': {
      preLoaderRoute: typeof JobsIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  JobsJobIdLazyRoute,
  JobsAddLazyRoute,
  JobsIndexRoute,
])

/* prettier-ignore-end */
