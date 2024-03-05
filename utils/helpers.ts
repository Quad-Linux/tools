import { SpawnOptions, exec, spawn } from "child_process"
import { promisify } from "util"

export const execAsync = promisify(exec)
export const spawnAsync = (
    cmd: string[],
    options: SpawnOptions
): Promise<string> =>
    new Promise((resolve, reject) => {
        const cp = spawn(cmd[0], cmd.slice(1), options)
        const stdout: string[] = []
        cp?.stdout?.on("data", (data) => stdout.push(data.toString()))

        cp.on("error", reject)

        cp.on("close", () => resolve(stdout.join("")))
    })
