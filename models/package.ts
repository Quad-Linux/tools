import { Data } from "dataclass"

export default class Package extends Data {
    id: string
    commit: string
    origin: string

    setCommit(commit: string): Package {
        // @ts-ignore
        return this.copy({ commit: commit })
    }
}
