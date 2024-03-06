import { execAsync, spawnAsync } from "./cli"
import { config } from "./config"

const getInstalled = async () =>
    (await flatpakExec("list", "--app", "--columns", "application"))
        .split("\n")
        .filter((line) => line.length)

const mask = async (remove: boolean = false) =>
    await spawnAsync(
        "pkexec",
        "flatpak",
        "mask",
        ...(remove ? ["--remove"] : []),
        "*"
    )

export const install = async () => {
    const [installedFlatpaks] = await getInstalled()
    const pkgsToInstall = config.pkgs.filter(
        (pkg) => !installedFlatpaks.includes(pkg.id)
    )

    if (pkgsToInstall.length)
        await flatpakSpawn("install", ...pkgsToInstall.map((pkg) => pkg.id))
}

export const uninstall = async () => {
    const installedFlatpaks = await getInstalled()
    const packagesToUninstall = installedFlatpaks.filter(
        (id) => !config.pkgs.find((pkg) => pkg.id == id)
    )

    if (packagesToUninstall.length)
        await flatpakSpawn("uninstall", ...packagesToUninstall)
}

export const upgrade = async () => {
    if (config.pkgs.length) {
        try {
            mask(true)
        } catch {}
        for (const pkg of config.pkgs) {
            await flatpakSpawn("update", pkg.id, "--commit", pkg.commit)
        }
        mask()
    }
}

export const flatpakSpawn = (...cmd: string[]) =>
    spawnAsync("flatpak", ...cmd, "--noninteractive")

export const flatpakExec = (...cmd: string[]) => execAsync("flatpak", ...cmd)
