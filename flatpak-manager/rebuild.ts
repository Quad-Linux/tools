#!/usr/bin/env -S pnpm tsx
import Config from "../models/config"
const config: Config = (await import(`${process.env.PWD}/config.ts`)).default

const installedPackages = config.installedPackages.map((installedPackage) =>
    installedPackage instanceof Object
        ? installedPackage
        : { id: installedPackage }
)
const installedFlatpaks = (
    await flatpakExec("list", "--app", "--columns", "application")
)
    .split("\n")
    .filter((line) => line.length)

const packagesToInstall = installedPackages.filter(
    (installedPackage) => !installedFlatpaks!.includes(installedPackage.id)
)

if (packagesToInstall.length)
    await flatpakSpawn("install", ...packagesToInstall.map((pkg) => pkg.id))

const packagesToUninstall = installedFlatpaks.filter(
    (installedPackage) => !installedPackages.includes({ id: installedPackage })
)

if (packagesToUninstall.length)
    await flatpakSpawn("uninstall", ...packagesToUninstall)
