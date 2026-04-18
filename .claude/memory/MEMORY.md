# BOLT.io Project Memory

## User
- GitHub: lnaul / naumovdimitriy@gmail.com
- Uses VS Code, prefers short confirmations ("run", "y", "commit")
- Building mobile game from scratch

## Project: BOLT.io - Electric Storm
- **Genre**: Isometric hyper-casual growing game (Tasty Planet + Crossy Road style)
- **Visual**: Isometric 2.5D pixel art, cyberpunk palette
- **Platform**: HTML5 → Mobile (iOS/Android), portrait
- **Mechanic**: Grow electric spark by absorbing objects, chain lightning combos
- **Scale**: 7 tiers SPARK(16px) → THUNDER(128px) with dynamic camera zoom
- **Objects**: 40+ isometric pixel art objects across 7 tiers
- **Monetization**: Ads 65% + IAP 35% (skins, power-ups, remove ads $2.99)
- **Timeline**: 3 weeks to MVP — started 2026-04-19
- **Why**: Zero competition for electric isometric growing game, high viral potential

## Development Progress
- **Status**: Active development — started 2026-04-19
- **Last commit**: `47dd4b3` — tap-to-move mobile controls
- **Built so far**:
  - Isometric renderer (`src/iso.js`) — tile grid, camera follow
  - Player spark (`src/player.js`) — glowing orb, lightning bolts, WASD + tap-to-move, grow on absorb
  - Objects (`src/objects.js`) — battery/coin/LED/plug with glow, absorption mechanic, score, respawn
  - Game loop (`src/game.js`) — HUD with tier name + wattage score, tap ripple indicator
  - Local server: `python3 -m http.server 8080` → http://localhost:8080
  - Mobile: connect phone to same WiFi → http://192.168.1.138:8080
- **Next**: Buildings with 3D height, then chain lightning effect

## GitHub
- **Repo**: https://github.com/lnaul/bolt.git (branch: main)
- **Auth**: PAT stored in remote URL (HTTPS) — if push fails, regenerate token and run:
  `git remote set-url origin https://NEW_TOKEN@github.com/lnaul/bolt.git`
- Token was exposed in chat 2026-04-19 — user advised to revoke and regenerate
