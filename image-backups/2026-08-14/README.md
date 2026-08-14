# Image quarantine: 2026-08-14

This archive removes non-runtime images from `assets/` while retaining byte-identical copies at their original relative paths under this directory.

Moved groups:

- `assets/terrain/`: superseded duplicate terrain collection with no runtime references.
- `assets/characters/face/old/`: retired face images.
- `assets/generated/old/`: retired generated backgrounds.
- `assets/managed/`: raw/editing masters; the directory contained only `source/`.
- `assets/map/overlays/source/`: high-resolution/editing sources.
- `assets/ui/menu-icons/source/`: editing metadata source.
- 21 oversized originals in `assets/map/terrain/`: each has a matching runtime-sized file in `assets/map/terrain/runtime/`.
- `assets/background/PRISMA ABYSS_old.png`: retired unreferenced background.

Protected and untouched:

- `assets/characters/walk/` (active work area).
- Save data, event flags, inventory, battle state, coordinates, level-up, and trait code/data.

`MOVE-MANIFEST.json` contains the original path, archived path, byte size, and SHA-256 for every moved file. `RESTORE-IMAGES.ps1` performs a preflight and refuses to overwrite any existing runtime file.

Production packaging must exclude both `image-backups/` and `backups/`.
