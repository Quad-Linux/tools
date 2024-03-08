import Config from "./models/config"
import ora from "ora"
import { install, uninstall, upgrade } from "./helpers/flatpak"
import chalk from "chalk"

export const createConfig = async (config: Config) => {
    const spinner = ora("Installing packages...").start()
    await install(config)

    spinner.text = "Uninstalling packages..."
    await uninstall(config)

    spinner.text = "Upgrading packages..."
    await upgrade(config)

    spinner.stop()
    console.info(chalk.bold("Done!"))
}

export { default as Package } from "./models/package"
