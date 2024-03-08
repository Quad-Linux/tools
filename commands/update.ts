import { writeFile } from "fs/promises"
import { execAsync } from "../helpers/cli"
import parseList from "../helpers/parseList"
import ora from "ora"
import chalk from "chalk"
import { join } from "path"
import { createCommand } from "commander"
import { homedir } from "os"

export default createCommand("update")
    .summary("update package lock")
    .action(async () => {
        const spinner = ora("Loading packages...").start()

        const installed = await execAsync(
            "flatpak remote-ls --system --columns=name,application,commit"
        )

        spinner.text = "Parsing packages..."
        const packages = parseList(installed)

        spinner.text = "Writing packages..."
        await writeFile(
            `${
                process.env.XDG_CONFIG_HOME ?? join(homedir(), ".config")
            }/quados/packages.ts`,
            `import { Package } from "quados"
export default {${Object.keys(packages).map(
                (key) =>
                    `${JSON.stringify(key)}: Package.create(${JSON.stringify(
                        packages[key]
                    )})`
            )}}`
        )
        spinner.stop()
        console.info(chalk.bold("Done!"))
    })
