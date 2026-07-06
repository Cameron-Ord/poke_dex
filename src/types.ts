export interface Page_Entry {
    name: string,
    url: string
}

export interface Stat_Entry {
    base_stat: number,
    stat: string
}

export interface Dex_Entry {
    id: number,
    name: string,
    sprite: string,
    cry: string,
    height: number,
    weight: number,
    base_exp: number,
    empty: boolean,
    types: string[],
    stats: Stat_Entry[]
}

export interface Display_Window {
    prev: Dex_Entry,
    current: Dex_Entry,
    next: Dex_Entry
}

export interface Pokedex {
    dex_position: number,
    dex_size: number,
    buffer: Dex_Entry[]
    buffer_position: number,
    display_window: Display_Window
}

export const WHEEL_STATES = {
    WHEEL_SEEKING: 1,
    WHEEL_RESTING: 2
} as const

export type WHEEL_STATES = typeof WHEEL_STATES[keyof typeof WHEEL_STATES];
