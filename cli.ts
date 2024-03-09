#!/usr/bin/env -S pnpm tsx
import { readdir } from "fs/promises"
import { program } from "commander"
import { join } from "path"

program.name("quad")

for (const command of await readdir(join(import.meta.dirname, "commands")))
    program.addCommand((await import(`./commands/${command}`)).default)

program.parse()
