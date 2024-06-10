import { Config } from "@quados/models"
import { install } from "./flatpak"
import { execAsync, spin } from "@quados/helpers"

export const createConfig = async (config: Config) => {
    try {
        await spin("Setting up the system...", setup())
        await spin("Installing packages...", install(config))
    } finally {
        await spin("Cleaning up...", cleanup())
    }
    // TODO: await spin("Configuring packages...", configure(config))
}

const setup = async () => {
    // Create @generations/current, @overlay, @home, @var
    // On change generation, make new subvol, build root there
    // Make immutable snapshot of new root
    // move old /current to be /<current date> in @generations
    // Move immutable snapshot to be @generations/current

    await execAsync("pkexec mkdir -p /var/lib/system")
    await execAsync("pkexec mount -t tmpfs -o size=1G tmpfs /var/lib/system")
}

const cleanup = async () => {
    await execAsync("pkexec umount /var/lib/system")
}
