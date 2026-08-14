# Character Runtime Assets

This folder is the runtime source of truth for character face images.

- File naming: `char_face_<characterId>.gif`
- Code hook: `characters.js` stores each character's `img` as `assets/characters/char_face_<id>.gif`.
- Raw generated or editing sources belong under `image-backups/YYYY-MM-DD/assets/managed/source/`, not in runtime `assets/`.
- Replaced accepted files should be moved to `image-backups/YYYY-MM-DD/assets/characters/` before adding the new version.
- `assets/characters/walk/` is an active work area and must not be archived without an explicit instruction.
