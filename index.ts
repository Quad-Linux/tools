import { Config } from "@quados/models"
import { install, uninstall, upgrade } from "./flatpak"
import spin from "@quados/helpers/spin"

export const createConfig = async (config: Config) => {
    await spin("Installing packages...", install(config))
    await spin("Uninstalling packages...", uninstall(config))
    await spin("Upgrading packages...", upgrade(config))
}
