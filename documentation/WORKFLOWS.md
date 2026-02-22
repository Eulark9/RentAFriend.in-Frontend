# CI/CD Workflow Documentation

This document explains how our two GitHub Actions workflow files work, what they do, and the versioning strategy we follow.

---

## Table of Contents

- [Overview](#overview)
- [develop.yml — PR Checks + Version Bump](#developyml)
- [release.yml — Release to Main](#releaseyml)
- [Versioning Strategy](#versioning-strategy)
- [Things to Keep in Mind](#things-to-keep-in-mind)

---

## Overview

We have two workflow files that automate our entire CI/CD process:

```
.github/
  workflows/
    develop.yml   ← runs on every PR to develop
    release.yml   ← runs on every PR to main
```

The goal is simple — **no broken code ever reaches main, and every release is properly versioned and tagged automatically.**

---

## develop.yml

**Trigger:** Every Pull Request opened, updated, or reopened targeting `develop`

### What it does

```
PR opened to develop
        │
        ├──▶ PR Title Check     must follow feat: fix: chore: etc
        ├──▶ Build              code must compile
        ├──▶ Lint               code must be clean
        └──▶ Security Audit     no high vulnerabilities
                    │
              all 4 passed ✅
                    │
                    ▼
             Version Bump
        feat: or feat!:  → minor bump  (0.1.0 → 0.2.0)
        anything else    → patch bump  (0.1.0 → 0.1.1)
        already bumped?  → skip
```

### Jobs breakdown

**1. PR Title Check**
Uses `amannn/action-semantic-pull-request` to enforce conventional commit format. Allowed types: `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`. If title is wrong, the entire pipeline is blocked immediately.

**2. Build**
Runs `npm ci` and `npm run build`. Confirms your code compiles successfully on a clean Ubuntu machine.

**3. Lint**
Runs `npm ci` and `npm run lint`. Checks code quality and style using ESLint with Vue plugin.

**4. Security Audit**
Runs `npm ci` and `npm audit --audit-level=high`. Checks all installed packages for known high severity vulnerabilities.

**5. Version Bump**
Only runs after all 4 above jobs pass. Reads the PR title, determines bump type, compares branch version vs develop version, and bumps only if not already bumped. Commits back to your PR branch automatically with message `chore: bump version [skip ci]`.

### Keep in mind

- Version bump is **skipped** if any of the 4 checks fail
- `feat!:` on develop gives a **minor bump** — the `!` is ignored on develop
- If you push multiple commits to the same PR, version only bumps **once**
- The `[skip ci]` tag on the bump commit prevents an infinite loop
- All 4 jobs run **in parallel** — version bump runs after all complete

---

## release.yml

**Trigger:** Pull Request opened or merged targeting `main`

### What it does

```
PR opened develop → main
        │
        ▼
Check minor version changed
develop minor > main minor  → ✅ release allowed
develop minor = main minor  → ❌ blocked — only patch changes found
        │
        ▼ (only runs if PR is merged)
Final build check
        │
        ▼
Determine bump type
feat!: or BREAKING CHANGE  → major bump  (0.2.0 → 1.0.0)
anything else              → minor bump  (0.1.4 → 0.2.0)
        │
        ▼
Bump version in package.json
        │
        ▼
Commit updated package.json to main
        │
        ▼
Create Git tag  e.g. v0.2.0 🎉
```

### Jobs breakdown

**1. Check Minor Version Changed**
Compares the minor version number of develop vs main. If develop minor is not greater than main minor, the PR is blocked with a clear error message. This ensures main only receives real feature releases, not just bug fix accumulations.

**2. Release**
Only runs after the version check passes AND the PR is actually merged. Runs a final build as a safety net, determines the bump type from the PR title, bumps the version, commits to main, and creates a Git tag.

### Keep in mind

- You **cannot** merge to main with only bug fixes — need at least one `feat:` merged to develop first
- Final build runs again on main as a **safety net** — even though develop already passed
- Git tag is only created **after merge** — not when PR is opened
- Major version bump only happens with `feat!:` or `BREAKING CHANGE` in the PR title
- Tags appear under the **Releases/Tags** section of your GitHub repo

---

## Versioning Strategy

We follow **Semantic Versioning** — `MAJOR.MINOR.PATCH`

### On develop branch — tracks every change

| PR Title | Bump Type | Example |
|---|---|---|
| `fix: anything` | patch | `0.1.0 → 0.1.1` |
| `chore: anything` | patch | `0.1.1 → 0.1.2` |
| `docs: anything` | patch | `0.1.2 → 0.1.3` |
| `feat: anything` | minor | `0.1.3 → 0.2.0` |
| `feat!: anything` | minor | `0.2.0 → 0.3.0` |

### On main branch — only real releases

| PR Title | Bump Type | Example |
|---|---|---|
| any normal merge | minor | `0.1.4 → 0.2.0` |
| `feat!:` or `BREAKING CHANGE` | major | `0.2.0 → 1.0.0` |
| patch-only changes | blocked ❌ | cannot merge |

### Real world example

```
develop activity:
  fix: navbar bug              →  0.0.1
  fix: login crash             →  0.0.2
  fix: mobile layout           →  0.0.3
  feat: add login page         →  0.1.0
  fix: login button color      →  0.1.1
  feat: add friend search      →  0.2.0
  fix: search crash            →  0.2.1

main releases:
  develop 0.1.1 → main         →  tag v0.1.0  (login feature release)
  develop 0.2.1 → main         →  tag v0.2.0  (search feature release)
  feat!: complete redesign     →  tag v1.0.0  (breaking change)
```

GitHub Tags page will show:
```
v1.0.0  ←  complete redesign
v0.2.0  ←  search feature release
v0.1.0  ←  login feature release
```

---

## Things to Keep in Mind

**For developers:**
- Always follow PR title conventions — wrong title = pipeline blocked immediately
- Never push directly to develop or main — always use PRs
- If your PR has only `fix:` commits, it cannot be merged to main until a `feat:` is added
- Version bump happens automatically — never bump manually

**For code owners:**
- Only merge develop → main when a feature is ready for release
- Use `feat!:` in the PR title only for real breaking changes
- Tags are permanent — think carefully before merging to main
- Monitor the Actions tab for any failed release jobs

**For everyone:**
- All jobs run on Ubuntu — Windows-specific issues won't show up locally
- `npm ci` is used in all jobs — not `npm install` — for consistent installs
- Security audit blocks on `high` severity only — moderate warnings are allowed
