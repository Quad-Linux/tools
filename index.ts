import Config from "./models/config"
import ora from "ora"
import { install, uninstall, upgrade } from "./helpers/flatpak"
import chalk from "chalk"
import spin from "./helpers/spin"

export const createConfig = async (config: Config) => {
    await spin("Installing packages...", install(config))
    await spin("Uninstalling packages...", uninstall(config))
    await spin("Upgrading packages...", upgrade(config))

    console.info(chalk.bold("Done!"))
}

export { default as Package } from "./models/package"
