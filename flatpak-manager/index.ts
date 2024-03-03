declare const process: { env: { [key: string]: string } }
const config: Config = await import(
    `${process.env.XDG_CONFIG_HOME || "~/.config"}/quados/index.ts`
)
export default {
    install: () => {},
}
