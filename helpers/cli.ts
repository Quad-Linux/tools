import { exec, spawn } from "child_process"
import { promisify } from "util"

export const execAsync = async (...cmd: string[]): Promise<string> => {
    const { stdout, stderr } = await promisify(exec)(cmd.join(" "))
    if (stderr) throw stderr
    return stdout
}
export const spawnAsync = (...cmd: string[]): Promise<void> =>
    new Promise((resolve, reject) => {
        const cp = spawn(cmd[0], cmd.slice(1), {
            stdio: "inherit",
        })

        cp.on("error", reject)
        cp.on("close", resolve)
    })
