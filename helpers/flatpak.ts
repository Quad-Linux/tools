import Package from "../models/package"
import { execAsync, spawnAsync } from "./cli"

export const install = (pkg: Package) => ""

export const flatpakSpawn = (...cmd: string[]) =>
    spawnAsync("flatpak", ...cmd, "--noninteractive")

export const flatpakExec = (...cmd: string[]) => execAsync("flatpak", ...cmd)
