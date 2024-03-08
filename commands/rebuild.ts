import chalk from "chalk"
import { install, uninstall, upgrade } from "../helpers/flatpak"
import { createCommand } from "commander"
import ora from "ora"

export default createCommand("rebuild")
    .summary("rebuild system")
    .action(async () => {})
