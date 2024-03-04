import { Data } from "dataclass"
import Package from "./package.ts"

export default class Config extends Data {
    installedPackages: Array<Package>
}
