import { Config } from "@quados/models"
import { /*configure,*/ install } from "./flatpak"
import { execAsync, spin } from "@quados/helpers"

export const createConfig = async (config: Config) => {
    try {
        await spin("Setting up the system...", setup())
        await spin("Installing packages...", install(config))
    } finally {
        await execAsync("pkexec umount /var/lib/system")
    }
    // TODO: await spin("Configuring packages...", configure(config))
}

const setup = async () => {
    await execAsync("pkexec mkdir -p /var/lib/system")
    await execAsync("pkexec mount -t tmpfs -o size=1G tmpfs /var/lib/system")
}
