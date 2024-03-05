#!/usr/bin/env -S pnpm tsx
import Config from "../models/config"
import { execAsync, spawnAsync } from "../utils/helpers"
const config: Config = (await import(`${process.env.PWD}/config.ts`)).default

await spawnAsync("flatpak", "install", ...config.installedPackages)

const installedPackages = await execAsync("flatpak", " list", "--app")

await spawnAsync(
    "flatpak",
    "uninstall",
    ...(installedPackages
        .split("\n")
        .map((installedPackage) =>
            config.installedPackages.includes(installedPackage)
                ? null
                : installedPackage
        )
        .filter((value) => value != null) as Array<string>)
)
