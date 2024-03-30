import { Config } from "@quados/models"
import { configure, install } from "./flatpak"
import { spin } from "@quados/helpers"

export const createConfig = async (config: Config) => {
    await spin("Installing packages...", install(config))
    await spin("Configuring packages...", configure(config))
}
