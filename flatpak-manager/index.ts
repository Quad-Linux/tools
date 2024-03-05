#!/usr/bin/env -S pnpm tsx
import Config from "../models/config"
import { spawnAsync } from "../utils/helpers"
const config: Config = (await import(`${process.env.PWD}/config.ts`)).default

const result = await spawnAsync(
    ["flatpak", "install", ...config.installedPackages],
    {
        stdio: "inherit",
    }
)

console.log(result)
