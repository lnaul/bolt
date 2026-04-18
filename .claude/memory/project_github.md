---
name: GitHub Setup
description: Git and GitHub configuration for the BOLT.io project
type: project
originSessionId: 097a4213-471a-42d6-9120-9a34376def76
---
- **Remote**: https://github.com/lnaul/bolt.git
- **Branch**: main
- **Auth**: Personal Access Token stored in remote URL (HTTPS)
- **Git user**: lnaul / naumovdimitriy@gmail.com
- **Note**: Token was exposed in chat on 2026-04-19 — user was advised to revoke and regenerate. If push fails with auth error, token may need refreshing via: `git remote set-url origin https://NEW_TOKEN@github.com/lnaul/bolt.git`

**How to apply:** Always check git status before committing. Confirm with user before pushing.
