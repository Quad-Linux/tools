import Config from "../models/config"

const config: Config = await import(
    `${process.env.XDG_CONFIG_HOME || "~/.config"}/quados/index.ts`
)
export default {
    install: () => {},
}
