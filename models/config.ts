import { Data } from "dataclass"

export default class Config extends Data {
    installedPackages: Array<string>
}
