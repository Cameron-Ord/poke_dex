export interface Entry {
    name: string,
    url: string
}

export interface Generation_Data {
    id: number,
    region: Entry,
    moves: Entry[],
    species: Entry[],
    types: Entry[],
    versions: Entry[]
}

export interface Generation_Entry {
    api_pagination: Entry,
    data: Generation_Data
}

export interface Pokemon_Data {

}

