# kcsu/web

A shared UI library and monorepo for some of KCSU's websites.

| App      | Description                                                                                           |
|----------|-------------------------------------------------------------------------------------------------------|
| `status` | [status.kcsu.org.uk](https://status.kcsu.org.uk): displays recent uptime information of KCSU's sites. |

## Getting started

Uses Node 24 (see `.node-version`) and pnpm through Corepack:

```sh
corepack enable pnpm
pnpm install

pnpm dev:status
pnpm build
pnpm check
```

## Deploying

```sh
pnpm build
npx firebase-tools deploy --only hosting:status
```
