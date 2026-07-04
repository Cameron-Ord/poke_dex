export interface Paginator_Entry {
    name: string,
    url: string
}

export interface Dex_Entry {
    id: number,
    name: string,
    sprite: string,
    cry: string,
    height: number,
    weight: number,
    base_exp: number,
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

export const CONTROL_FLOW = {
    DEX_SEEK_UNCHANGED: 1,
    DEX_SEEK_BACKWARD: 2,
    DEX_SEEK_FORWARD: 3
} as const

export type CONTROL_FLOW = typeof CONTROL_FLOW[keyof typeof CONTROL_FLOW];