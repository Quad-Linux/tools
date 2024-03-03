import { Data } from "dataclass"
import Package from "./package"

export default class Config extends Data {
    packages: Array<Package>
}
