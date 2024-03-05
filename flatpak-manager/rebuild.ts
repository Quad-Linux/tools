#!/usr/bin/env -S pnpm tsx
import Config from "../models/config"
import { execAsync, spawnAsync } from "../utils/helpers"
const config: Config = (await import(`${process.env.PWD}/config.ts`)).default

const installedPackages = config.installedPackages.map((installedPackage) =>
    installedPackage instanceof Object ? installedPackage.pkg : installedPackage
)
const installedFlatpaks = (
    await execAsync("flatpak", "list", "--app", "--columns", "application")
)
    .split("\n")
    .filter((line) => line.length > 0)

const packagesToInstall = installedPackages.filter(
    (installedPackage) => !installedFlatpaks!.includes(installedPackage)
)

if (packagesToInstall.length)
    await spawnAsync(
        "flatpak",
        "install",
        "--noninteractive",
        ...packagesToInstall
    )

const packagesToUninstall = installedFlatpaks.filter(
    (installedPackage) => !installedPackages.includes(installedPackage)
)

if (packagesToUninstall.length)
    await spawnAsync(
        "flatpak",
        "uninstall",
        "--noninteractive",
        ...packagesToUninstall
    )
