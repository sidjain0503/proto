# Client Overlay

This folder is for **fork-specific** code. The Proto foundation loads it automatically if present.

## What goes here

- Custom API modules (`modules/`)
- Client-specific config overrides
- Additional database migrations (`db/migrations/` — future)

## What does NOT go here

- Changes to core auth, chat, or security — those belong upstream in Proto

## Adding a custom API module

```js
// client/modules/AcmeRoutes.js
module.exports = {
  id: "acme",
  register(router) {
    router.get("/acme/status", (req, res) => {
      req.log.info("Acme status check");
      res.json({ ok: true });
    });
  },
};
```

```js
// client/index.js
module.exports = {
  modules: [require("./modules/AcmeRoutes")],
  configOverrides: {},
};
```

## Rules

1. Foundation code must never `require()` from `client/`
2. Client code registers via exports in `client/index.js`
3. Keep client changes isolated for clean upstream merges

See [UPGRADE.md](../docs/UPGRADE.md) for merging Proto updates into a client fork.
