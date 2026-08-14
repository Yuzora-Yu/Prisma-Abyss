# Image Backups

This directory is the explicit quarantine for image sources, replaced images, and retired runtime assets.

- Keep production runtime images under `assets/` only.
- Keep quarantined files under a dated directory: `image-backups/YYYY-MM-DD/`.
- Preserve the original project-relative layout below the dated directory.
- Record every move in that date's `MOVE-MANIFEST.json`.
- Do not deploy `image-backups/` or `backups/` to production.
- Do not archive `assets/characters/walk/` without an explicit instruction; it is an active work area.

Files here are not deleted. Use the dated restore script or request a rollback after reviewing destination conflicts.
