export interface Paginator_Entry {
    name: string,
    url: string
}

export interface Ability_Content {
    paginator: Paginator_Entry
    is_hidden: boolean,
    slot: number
}

export interface Encounter_Content {
    paginator: Paginator_Entry,
}

export interface Move_Content {
    paginator: Paginator_Entry,
}

export interface Type_Content {
    paginator: Paginator_Entry,
    slot: number
}

export interface Stat_Content {
    paginator: Paginator_Entry,
    effort: number,
    base_number: number,
}

export interface Species_Content {
    paginator: Paginator_Entry,
}

export interface Pokemon_Content{
    paginator: Paginator_Entry,

    sprite: string,
    abilities: Ability_Content
    types: Type_Content[],
    encounters: Encounter_Content[],
    moves: Move_Content[],

    base_exp: number,
    cries: string,
    height: number,
    weight: number,
    held_items: string[],
    is_default: boolean,
}

export interface Dex_Entry {
    id: number,
    name: string,
    pokemon_details: Pokemon_Content,
    species_details: Species_Content
}

export interface Pokedex {
    position: number,
    dex_size: number,
    buffer: Dex_Entry[]
}


