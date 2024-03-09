import chalk from "chalk"
import { createCommand } from "commander"
import { flatpakExec } from "../helpers/flatpak"
import { homedir } from "os"
import Package from "../models/package"

export default createCommand("commits")
    .summary("view commits for a package")
    .argument("<app>", "the application to look for")
    .action(async (app: string) => {
        const { default: pkgs }: { default: Record<string, Package> } =
            await import(
                `${
                    process.env.XDG_CONFIG_HOME ?? `${homedir()}/.config`
                }/quados/packages.ts`
            )

        const pkg = pkgs[app]
        const history = await flatpakExec(
            `remote-info --log ${pkg.origin} ${pkg.id}`
        )
        console.info(history)
    })
