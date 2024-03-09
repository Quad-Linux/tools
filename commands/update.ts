import { writeFile } from "fs/promises"
import { execAsync } from "../helpers/cli"
import parseList from "../helpers/parseList"
import { createCommand } from "commander"
import spin from "../helpers/spin"

export default createCommand("update")
    .summary("update package lock")
    .action(async () => {
        const installed = await spin(
            "Loading packages...",
            execAsync(
                "flatpak remote-ls --system --columns=name,application,commit,origin"
            )
        )

        const packages = parseList(installed)

        await spin(
            "Writing packages...",
            writeFile(
                `./packages.ts`,
                `import { Package } from "quados"
export default {${Object.keys(packages).map(
                    (key) =>
                        `${JSON.stringify(
                            key
                        )}: Package.create(${JSON.stringify(packages[key])})`
                )}}`
            )
        )
    })
