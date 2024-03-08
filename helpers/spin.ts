import chalk from "chalk"
import ora from "ora"

export default async (message: string, promise: Promise<any>) => {
    const spinner = ora(message).start()
    await promise
    spinner.suffixText = chalk.bold("Done!")
    spinner.stopAndPersist()
}
