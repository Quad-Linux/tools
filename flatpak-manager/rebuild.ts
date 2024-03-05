#!/usr/bin/env -S pnpm tsx
import Config from "../models/config"
import { flatpakExec, flatpakSpawn } from "../utils/helpers"
const config: Config = (await import(`${process.env.PWD}/config.ts`)).default

const installedPackages = config.installedPackages.map((installedPackage) =>
    installedPackage instanceof Object ? installedPackage.pkg : installedPackage
)
const installedFlatpaks = (
    await flatpakExec("list", "--app", "--columns", "application")
)
    .split("\n")
    .filter((line) => line.length > 0)

const packagesToInstall = installedPackages.filter(
    (installedPackage) => !installedFlatpaks!.includes(installedPackage)
)

if (packagesToInstall.length)
    await flatpakSpawn("install", ...packagesToInstall)

const packagesToUninstall = installedFlatpaks.filter(
    (installedPackage) => !installedPackages.includes(installedPackage)
)

if (packagesToUninstall.length)
    await flatpakSpawn("uninstall", ...packagesToUninstall)
