import Config from "../models/config.ts"
import packages from "./packages.ts"
const config: Config = await import(
    `${process.env.XDG_CONFIG_HOME || "~/.config"}/quados/index.ts`
)
export default {
    install: () => {},
}
