import { Data } from "dataclass"
import Package from "./package"

export default interface Config {
    pkgs: Array<Package>
}
