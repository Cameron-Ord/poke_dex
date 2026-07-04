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
    position: number,
    dex_size: number,
    buffer: Dex_Entry[]
    display_window: Display_Window
}


