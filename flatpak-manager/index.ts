import Config from "../models/config.ts"
const config: Config = await import(
    `${process.env.XDG_CONFIG_HOME || "~/.config"}/quados/index.ts`
)
export default {
    install: () => {},
}
