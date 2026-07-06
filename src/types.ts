export interface Page_Entry {
    name: string,
    url: string
}

export interface Destructured {
    count: number,
    next: null | string,
    previous: null | string,
    results: Page_Entry[]
}

export const WHEEL_STATES = {
    WHEEL_SEEKING: 1,
    WHEEL_RESTING: 2
} as const

export type WHEEL_STATES = typeof WHEEL_STATES[keyof typeof WHEEL_STATES];
