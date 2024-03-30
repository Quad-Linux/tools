import { Config } from "@quados/models"
import { /*configure,*/ install } from "./flatpak"
import { execAsync, spin } from "@quados/helpers"

export const createConfig = async (config: Config) => {
    await execAsync("mkdir -p ~/.local/share/system")

    await spin("Installing packages...", install(config))
    // TODO: await spin("Configuring packages...", configure(config))
}
