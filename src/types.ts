export interface Entry {
    name: string,
    url: string
}

export interface Generation_Paginator_Body {
    id: number,
    region: Entry,
    moves: Entry[],
    species: Entry[],
    types: Entry[],
    versions: Entry[]
}

export interface Generation_Paginator {
    head: Entry,
    body: Generation_Paginator_Body
}

export interface Pokemon_Data {

}

