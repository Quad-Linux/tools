import { Data } from "dataclass"

export class Package extends Data {
    id: string
    commit: string
    origin: string

    withCommit(commit: string): Package {
        // @ts-ignore
        return this.copy({ commit: commit })
    }
}
