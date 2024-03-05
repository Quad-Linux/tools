#!/usr/bin/env -S pnpm tsx
import { writeFile } from "fs/promises"
import { execAsync, normalizeString } from "../utils/helpers"

const installed = await execAsync(
    "flatpak remote-ls --columns=name,application"
)

const output = installed
    .split("\n")
    .filter((line) => line.length > 0)
    .reduce((result, line) => {
        const [key, value] = line.split("\t")
        let normalizedKey = normalizeString(key)

        result[normalizedKey] = value
        return result
    }, {})

await writeFile(
    "packages.ts",
    `export default ${JSON.stringify(output, null, 2)}`
)
