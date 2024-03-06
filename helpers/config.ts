import Config from "../models/config"

export const config: Config = (await import(`${process.env.PWD}/config.ts`))
    .default
