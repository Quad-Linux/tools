#!/usr/bin/env -S pnpm tsx
import { install, uninstall, upgrade } from "../helpers/flatpak"

await install()
await uninstall()
await upgrade()
