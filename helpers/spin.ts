import chalk from "chalk"
import ora from "ora"

export default async function spin<Type>(
    message: string,
    promise: Promise<Type>
): Promise<Type> {
    const spinner = ora(message).start()
    const result = await promise
    spinner.suffixText = chalk.bold("Done!")
    spinner.stopAndPersist()
    return result
}
