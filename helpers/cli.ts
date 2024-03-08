import { ExecOptions, ExecOptionsWithStringEncoding, exec } from "child_process"
import { promisify } from "util"

export const execAsync = async (
    cmd: string,
    options?: ExecOptions
): Promise<string> => {
    const { stdout, stderr } = await promisify(exec)(cmd, options)
    if (stderr) throw stderr
    return stdout as string
}
