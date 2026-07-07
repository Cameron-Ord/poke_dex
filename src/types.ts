export interface Pokemon_Cry {
    name: string
    url: string
}

export interface Pokemon_Stat {
    name: string
    value: number
}

export interface Pokemon_Type {
    name: string
    slot: number
}

export interface Pokemon_Ability {
    name: string
    is_hidden: boolean
    slot: number
}

export interface Pokemon_Artwork {
    normal: string
    shiny: string
}

// Contains any information that can be acquired from the specified pokemon 
// That does not require subsequent api calls to fill.
export interface Pokemon_Information_Generic {
    name: string
    base_experience: number
    cries: Pokemon_Cry[]
    height: number
    weight: number
    held_items: string[]
    move_names: string[]
    official_artwork_urls: Pokemon_Artwork
    abilities: Pokemon_Ability[]
    stats: Pokemon_Stat[]
    type: Pokemon_Type[]
}



export const WHEEL_STATES = {
    WHEEL_SEEKING: 1,
    WHEEL_RESTING: 2
} as const

export type WHEEL_STATES = typeof WHEEL_STATES[keyof typeof WHEEL_STATES];
