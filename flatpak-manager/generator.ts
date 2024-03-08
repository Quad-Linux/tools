#!/usr/bin/env -S pnpm tsx
import { writeFile } from "fs/promises"
import { execAsync } from "../helpers/cli"
import parseList from "../helpers/parseList"

const installed = await execAsync(
    "flatpak remote-ls --system --columns=name,application,commit"
)

const packages = parseList(installed)

await writeFile(
    "packages.ts",
    `import Package from "@quados/tools/models/package"
	export default {${Object.keys(packages).map(
        (key) =>
            `${JSON.stringify(key)}: Package.create(${JSON.stringify(
                packages[key]
            )})`
    )}}`
)
