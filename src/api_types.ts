export interface Name_Pair {
    name: string
    url: string
}

export interface Cry_Urls{
    latest: string
    legacy: string
}

export interface Artwork_Urls {
    front_default: string
    front_shiny: string
}

export interface Item_Version_Details {
    rarity: number
    version: Name_Pair
}

export interface Move_Version_Group_Details {
    level_learned_at: number
    move_learn_method: Name_Pair
    order: null | number
    version_group: Name_Pair
}

export interface Held_Item_Object {
    item: Name_Pair
    version_details: Item_Version_Details[]
}

export interface Pokemon_Move_Object {
    move: Name_Pair
    version_group_details: Move_Version_Group_Details[]
}

export interface Ability_Object {
    ability: Name_Pair
    is_hidden: boolean
    slot: number
}

export interface Stat_Object {
    base_stat: number
    effort: number
    stat: Name_Pair
}

export interface Type_Object {
    slot: number
    type: Name_Pair
}

export interface Destructured {
    count: number
    next: null | string
    previous: null | string
    results: Name_Pair[]
}

