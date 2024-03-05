#!/usr/bin/env -S pnpm tsx
import { exit } from "process"
import { writeFile } from "fs/promises"
import { execAsync } from "../utils/helpers"

function formatString(inputString: string): string {
    let regexedString = inputString.replace(/[\s-]/g, "")
    let chars = regexedString.split("")

    chars[0] = chars[0].toLowerCase()

    for (let i = 1; i < chars.length; i++) {
        if (chars[i - 1] === " " || chars[i - 1] === "-") {
            chars[i] = chars[i].toUpperCase()
        }
    }

    return chars.join("")
}

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
        let normalizedKey = formatString(key)

        result[normalizedKey] = value
        return result
    }, {})

await writeFile(
    "packages.ts",
    `export default ${JSON.stringify(output, null, 2)}`
)
