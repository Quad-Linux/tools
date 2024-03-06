import Package from "../models/package"

export default (output: string): { pkg: Package } =>
    output
        .split("\n")
        .filter((line) => line.length > 0)
        .reduce((result, line) => {
            const [key, value, commit] = line.split("\t")
            let normalizedKey = normalizeString(key)

            result[normalizedKey] = Package.create({ id: value, commit })
            return result
        }, {} as { pkg: Package })

const normalizeString = (inputString: string): string => {
    let regexedString = inputString.replace(/[\s'-]/g, "")
    let chars = regexedString.split("")

    chars[0] = chars[0].toLowerCase()

    for (let i = 1; i < chars.length; i++) {
        if (chars[i - 1] === " " || chars[i - 1] === "-") {
            chars[i] = chars[i].toUpperCase()
        }
    }

    return chars.join("")
}
