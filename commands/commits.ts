import chalk from "chalk"
import { createCommand } from "commander"
import { flatpakExec } from "../helpers/flatpak"
import { homedir } from "os"
import Package from "../models/package"
import spin from "../helpers/spin"

export default createCommand("commits")
    .summary("view commits for a package")
    .argument("<app>", "the application to look for")
    .action(async (app: string) => {
        const { default: pkgs }: { default: Record<string, Package> } =
            await spin(
                "Importing packages...",
                import(
                    `${
                        process.env.XDG_CONFIG_HOME ?? `${homedir()}/.config`
                    }/quados/packages.ts`
                )
            )

        const pkg = pkgs[app]
        if (!pkg)
            return console.error(chalk.red.bold("That package does not exist."))

        const history = await spin(
            "Getting package history...",
            flatpakExec(`remote-info --log ${pkg.origin} ${pkg.id}`)
        )
        console.info(history)
    })
