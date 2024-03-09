import { Config } from "./models/config"
import { install, uninstall, upgrade } from "@quados/helpers/flatpak"
import spin from "@quados/helpers/spin"

export const createConfig = async (config: Config) => {
    await spin("Installing packages...", install(config))
    await spin("Uninstalling packages...", uninstall(config))
    await spin("Upgrading packages...", upgrade(config))
}

export { Package } from "./models/package"
export { Config } from "./models/config"
