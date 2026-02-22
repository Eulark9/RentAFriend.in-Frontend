# Contributing Guide

Welcome to the team! Before you open your first Pull Request, please read this guide carefully. It explains how our CI pipeline works and how to name your PRs correctly.

---

## Quick Reference Card

```
New feature?         →   feat: describe your feature
Bug fix?             →   fix: describe the bug you fixed
Updating packages?   →   chore: update dependencies
Writing docs?        →   docs: describe what you documented
Cleaning up code?    →   refactor: describe what you cleaned
CSS changes only?    →   style: describe the style change
Breaking change?     →   feat!: describe the breaking change
```


## Table of Contents

- [How to Name Your Pull Requests](#how-to-name-your-pull-requests)
- [How Our CI Pipeline Works](#how-our-ci-pipeline-works)
- [How Versioning Works](#how-versioning-works)
- [Full Flow Example](#full-flow-example)

---


## How to Name Your Pull Requests

We follow a standard called **Conventional Commits**. Every PR title must follow this format:

```
type: short description
```

### Allowed Types

| Type | When to use | Example |
|---|---|---|
| `feat` | Adding a new feature | `feat: add user login page` |
| `fix` | Fixing a bug | `fix: broken navbar on mobile` |
| `chore` | Maintenance, dependencies, config | `chore: update npm packages` |
| `docs` | Documentation changes only | `docs: update README` |
| `refactor` | Code restructure, no new feature or fix | `refactor: clean up App.vue` |
| `style` | CSS, formatting, no logic change | `style: fix button alignment` |
| `test` | Adding or updating tests | `test: add login unit tests` |

### Breaking Changes

If your change breaks existing functionality, add a `!` after the type:

```
feat!: redesign entire authentication system
```

This signals a **major version bump** when merged to main.

### Rules

- Always lowercase after the colon
- Keep it short and clear — one line
- No period at the end
- Must start with one of the allowed types above

### Good vs Bad Examples

```
✅  feat: add friend search functionality
✅  fix: login form validation not working
✅  chore: upgrade vite to v7
✅  feat!: replace REST API with GraphQL

❌  updated some stuff
❌  Fix login
❌  FEAT: add search
❌  feat: Add search.        ← capital A and period not allowed
```

> If your PR title is wrong, the pipeline will automatically block your PR and you will see a failed check called **PR Title Check**. Simply edit your PR title to fix it — no need to push new code.

---

## How Our CI Pipeline Works

We have two workflow files that run automatically on every Pull Request to `develop`.

### File 1 — `ci.yml` (Quality Checks)

This file runs four checks in parallel the moment you open or update a PR:

```
You open a PR to develop
         │
         ├──▶  PR Title Check     checks your PR title format
         │
         ├──▶  Build              runs: npm run build
         │                        makes sure your code compiles
         │
         ├──▶  Lint               runs: npm run lint
         │                        checks your code style and quality
         │
         └──▶  Security Audit     runs: npm audit
                                  checks for known vulnerabilities
                                  in your npm packages
```

**All four must pass before your PR can be merged.**

If any check fails you will see a red ❌ on your PR. Click on it to see the exact error. Fix the issue, push your code again, and the checks will re-run automatically.

### File 2 — `version-bump.yml` (Auto Version Update)

This file runs after you open or update a PR. It reads your PR title and automatically bumps the version number in `package.json` and `package-lock.json`.

```
Your PR title is read
         │
         ├──▶  title starts with feat:    →  minor bump  (0.1.0 → 0.2.0)
         │
         └──▶  anything else (fix, chore, etc) →  patch bump  (0.1.0 → 0.1.1)
```

The version bump is committed automatically back to your branch by GitHub Actions. You do not need to do anything — just wait a few seconds after opening your PR and you will see a new commit appear on your branch titled:

```
chore: bump version [skip ci]
```

> The `[skip ci]` tag prevents an infinite loop — it tells GitHub not to run the pipeline again for this automatic commit.

---

## How Versioning Works

We use **Semantic Versioning** — every version number has three parts:

```
MAJOR . MINOR . PATCH
  0   .   1   .   4
```

| Part | Bumps when | Example |
|---|---|---|
| `PATCH` | A bug fix, small change | `0.1.4 → 0.1.5` |
| `MINOR` | A new feature added | `0.1.4 → 0.2.0` |
| `MAJOR` | A breaking change (`feat!`) merged to main | `0.2.0 → 1.0.0` |

### On `develop` branch

Every PR bumps either patch or minor based on your PR title. This keeps a detailed history of every change made during development.

```
fix: navbar bug          →  0.0.1
fix: login crash         →  0.0.2
feat: add login page     →  0.1.0   ← minor bump, new feature
fix: login button color  →  0.1.1
feat: add search         →  0.2.0   ← minor bump, new feature
```

### On `main` branch

Main only receives merges from develop when a real release is ready. When merged, the version from develop carries over and a Git **tag** is created — this is your official release marker.

```
develop: 0.2.1  →  merged to main  →  tag v0.2.0 created on GitHub
develop: 0.3.4  →  merged to main  →  tag v0.3.0 created on GitHub
```

You can see all releases on GitHub under the **Tags** section of the repo.

---

## Full Flow Example

Here is what a complete feature development cycle looks like:

```
1. Developer creates branch:  git checkout -b feature/add-login

2. Developer writes code and opens PR to develop
   PR title: "feat: add user login page"

3. GitHub automatically runs:
   ✅ PR Title Check    — title is valid
   ✅ Build             — code compiles successfully
   ✅ Lint              — no code style issues
   ✅ Security Audit    — no vulnerabilities found
   ✅ Version Bump      — version bumped from 0.0.0 to 0.1.0

4. Team reviews and approves the PR

5. PR is merged to develop
   develop is now at version 0.1.0

6. More PRs are merged to develop over time:
   fix: login validation  →  0.1.1
   fix: mobile layout     →  0.1.2

7. Team decides develop is stable and ready for release
   PR opened: develop → main

8. PR merged to main
   Tag v0.1.0 created automatically on GitHub 🎉
```

---

## Quick Reference Card

```
New feature?         →   feat: describe your feature
Bug fix?             →   fix: describe the bug you fixed
Updating packages?   →   chore: update dependencies
Writing docs?        →   docs: describe what you documented
Cleaning up code?    →   refactor: describe what you cleaned
CSS changes only?    →   style: describe the style change
Breaking change?     →   feat!: describe the breaking change
```

If you have any questions, reach out to the team before opening your PR.

develop.yml explaination 
## The flow is now crystal clear
```
PR opened to develop
        │
        ├──▶ PR Title Check ──┐
        ├──▶ Build ───────────┤  all run in parallel
        ├──▶ Lint ────────────┤
        └──▶ Security Audit ──┘
                    │
              all 4 passed? ✅
                    │
                    ▼
             Version Bump
          (only runs if everything above passed)


## Release.yaml explanation

## What this file does
```
PR from develop → main is merged
        │
        ▼
Reads version from package.json
        │
        ├──▶ PR title has feat!: or BREAKING CHANGE  →  major bump  (0.2.0 → 1.0.0)
        └──▶ anything else                            →  minor bump  (0.1.4 → 0.2.0)
        │
        ▼
Commits updated package.json to main
        │
        ▼
Creates Git tag  e.g. v0.2.0 🎉
```

---

## Your final workflows folder now looks like
```
.github/
  workflows/
    develop.yml   ← PRs to develop (checks + version bump)
    release.yml   ← merge to main (release tag)