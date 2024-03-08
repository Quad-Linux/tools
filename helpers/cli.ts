import { exec } from "child_process"
import { promisify } from "util"

export const execAsync = async (...cmd: string[]): Promise<string> => {
    const { stdout, stderr } = await promisify(exec)(cmd.join(" "))
    if (stderr) throw stderr
    return stdout
}
