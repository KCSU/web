# kcsu/web

A shared UI library and monorepo for some of KCSU's websites.

| App      | Description                                                                                           |
|----------|-------------------------------------------------------------------------------------------------------|
| `site`   | [kcsu.org.uk](https://kcsu.org.uk): WIP main KCSU site.                                               |
| `status` | [status.kcsu.org.uk](https://status.kcsu.org.uk): displays recent uptime information of KCSU's sites. |

## Getting started

Uses Node 24 (see `.node-version`) and pnpm through Corepack:

```sh
corepack enable pnpm
pnpm install

pnpm dev:site     # or dev:status
pnpm check
pnpm build
```

## Deploying

```sh
pnpm build
npx firebase-tools deploy --only hosting:site    # or hosting:status
```
