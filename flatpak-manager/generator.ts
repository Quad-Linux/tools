#!/usr/bin/env -S pnpm tsx
import { exit } from "process"
import { writeFile } from "fs/promises"
import { execAsync, normalizeString } from "../utils/helpers"

const { stdout, stderr } = await execAsync(
    "flatpak remote-ls --columns=name,application"
)

if (stderr) {
    console.error(`Error executing command: ${stderr}`)
    exit(1)
}

const output = stdout
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
