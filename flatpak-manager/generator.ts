import { exec } from "child_process"
import { exit } from "process"
import { promisify } from "util"
import { writeFile } from "fs/promises"
const execAsync = promisify(exec)

const { stdout, stderr } = await execAsync(
    "flatpak remote-ls --columns=name,application"
)

if (stderr) {
    console.error(`Error executing command: ${stderr}`)
    exit(1)
}

// Process the output
const output = stdout
    .split("\n")
    .filter((line) => line.length > 0)
    .reduce((result, line) => {
        const [key, value] = line.split("\t")
        const normalizedKey = key
            .replace(/ /g, "")
            .toLowerCase()
            .replace(/_./g, (match) => match.charAt(1).toUpperCase())
        result[normalizedKey] = value
        return result
    }, {})

await writeFile(
    "flatpak-manager/packages.ts",
    `export default ${JSON.stringify(output, null, 2)}`
)
