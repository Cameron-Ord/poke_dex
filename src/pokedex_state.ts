import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { type Pokedex, type Dex_Entry, type Display_Window, type Stat_Entry } from "./types";

import axios from 'axios';

export const dex_state = defineStore('dex_state', ()=> {
    const api_base_url: string = "https://pokeapi.co/api/v2/pokemon"
    const api_has_error = ref<boolean>(false)

    const DISP_BUFFER_MAX = 32

    const pokedex = ref<Pokedex>(zeroed_dex())
    const get_pokedex = computed(()=>pokedex)
    const get_display_cards = computed(() =>pokedex.value.display_window)


    //Returns true if need to update cards with a call to API
    //I need to implement some tracking if the wheel is being spun and only request once it has stopped
    //non negotiable as it will prevent needless api calls and make things more responsive feeling
    async function scroll_update_positions(direction: number) : Promise<void> {
        const disp_len = pokedex.value.buffer.length
        let next = pokedex.value.buffer_position + direction

        if(next >= 0 && next < disp_len){
            pokedex.value.buffer_position = next

        } else if(next < 0) {
            if(pokedex.value.dex_position <= 0){
                return
            }
            pokedex_seek_backward()
            pokedex.value.buffer_position = disp_len - 1
            await pokedex_buffer_assign(request_pokemon_consecutive())

        } else if(next >= disp_len){
            if(pokedex.value.dex_position >= pokedex.value.dex_size){
                return
            }
            pokedex_seek_forward()
            pokedex.value.buffer_position = 0
            await pokedex_buffer_assign(request_pokemon_consecutive())
        }

        display_cards_check_empty(display_cards_update())
    }

    function pokedex_seek_backward(){
        const disp_len: number = pokedex.value.buffer.length
        const dex_position: number = pokedex.value.dex_position
        const dex_min: number = 0
        let next_pokedex_position: number = dex_position - disp_len

        if(next_pokedex_position < dex_min) {
            next_pokedex_position = dex_min
        }
        pokedex.value.dex_position = next_pokedex_position
    }

    function pokedex_seek_forward(){
        const disp_len: number = pokedex.value.buffer.length
        const dex_position: number = pokedex.value.dex_position
        const dex_len: number = pokedex.value.dex_size
        let next_pokedex_position: number = dex_position + disp_len

        if(next_pokedex_position > dex_len){
            next_pokedex_position = dex_len
        }
        pokedex.value.dex_position = next_pokedex_position
    }


    function zeroed_display_window(): Display_Window {
        return {
            prev: zeroed_entry(),
            current: zeroed_entry(),
            next:zeroed_entry(),
        }
    }
 
    function zeroed_entry(): Dex_Entry {
        return {
            id: 0,
            name: "",
            sprite: "",
            cry: "",
            height: 0,
            weight: 0,
            base_exp: 0,
            empty: true,
            types: [],
            stats: []
        }
    }

    function zeroed_dex(): Pokedex {
        return {
            dex_position: 0,
            dex_size: 0,
            buffer: Array.from({ length: DISP_BUFFER_MAX }, () => zeroed_entry()),
            buffer_position: 0,
            display_window: zeroed_display_window()
        }
    }

    async function set_dex_size(unresolved: Promise<number>): Promise<void> {
        const new_size: number = await unresolved
        pokedex.value.dex_size = new_size
        return
    }

    async function display_cards_check_empty(unresolved: Promise<Display_Window>) {
        const display_window: Display_Window = await unresolved
        const dex_entries: Dex_Entry[] = [ 
            display_window.prev, 
            display_window.current, 
            display_window.next
        ]

        for(let ent = 0; ent < dex_entries.length; ent++){
            if(dex_entries[ent].name.length != 0){
                continue
            } else {
                dex_entries[ent].empty = true
            }
        }
    }

    async function display_cards_update(): Promise<Display_Window> {
        const pokemon_buffer = pokedex.value.buffer
        const buflen: number = pokemon_buffer.length
        const current: number = pokedex.value.buffer_position

        let display_window = pokedex.value.display_window

        const prev: number = current - 1
        if(prev >= 0 && prev < buflen){
            display_window.prev = pokemon_buffer[prev]
        } else {
            display_window.prev = zeroed_entry()
        }

        display_window.current = pokemon_buffer[current]

        const next: number = current + 1
        if(next >= 0 && next < buflen){
            display_window.next = pokemon_buffer[next]
        } else {
            display_window.next = zeroed_entry()
        }

        return display_window
    }

    async function pokedex_buffer_assign(unresolved: Promise<Dex_Entry[]>): Promise<void> {
        const requested_pokemon: Dex_Entry[] = await unresolved
        let current_pokemon: Dex_Entry[] = pokedex.value.buffer

        current_pokemon.length = requested_pokemon.length
        if(current_pokemon.length > DISP_BUFFER_MAX) {
            current_pokemon.length = DISP_BUFFER_MAX
            requested_pokemon.length = DISP_BUFFER_MAX
        }

        for(let i = 0; i < current_pokemon.length && i < requested_pokemon.length; i++){
            current_pokemon[i] = requested_pokemon[i]
        }   
    }

    async function request_pokemon_consecutive(): Promise<Dex_Entry[]> {
        const dex_size: number = pokedex.value.dex_size

        let tmp: Dex_Entry[] = []
        for(let i = 1; i <= DISP_BUFFER_MAX; i++){
            const position: number = pokedex.value.dex_position
            const entry_number: number = position + i

            if(entry_number < 0 || entry_number >= dex_size) {
                return tmp
            }
            const endpoint: string = `${api_base_url}/${entry_number}`
            const entry: Dex_Entry = await request_pokemon(endpoint)
            tmp.push(entry)
        }

        return tmp
    }

    function stat_data_transform(stats: [{base_stat: number, effort: number, stat:{name: string, url: string}}]): Stat_Entry[] {
        let transformed: Stat_Entry[] = []
        for(let i = 0; i < stats.length; i++){
            transformed.push({base_stat: stats[i].base_stat, stat: stats[i].stat.name})
        }
        return transformed
    }

    function type_data_transform(types: [{slot: number, type: {name: string, url: string}}]): string[] {
        let transformed: string[] = []
        for(let i = 0; i < types.length; i++){
            transformed.push(types[i].type.name)
        }
        return transformed
    }

    async function request_pokemon(endpoint: string): Promise<Dex_Entry>  {
        try {
            const resp = await axios.get(endpoint)
            const data = resp['data']
            return {
                id: data['id'] || 0,
                name: data['name'] || "",
                sprite: data['sprites']['other']['official-artwork']['front_default'] || "",
                cry: data['cries']['latest'] || "",
                height: data['height'] || 0,
                weight: data['weight'] || 0,
                base_exp: data['base_experience'] || 0,
                empty: false,
                types: type_data_transform(data['types']),
                stats: stat_data_transform(data['stats']),
            }
        } catch (error) {
            console.log(error)
        }
        return zeroed_entry()
    }

    async function request_pokemon_count(): Promise<number> {
        try {
            const response = await axios.get(api_base_url, {
                params:{
                    limit: 1
                }
            })
            const count: number = response['data']['count']
            return count
        } catch (error) {
            console.log(error)
        }
        return 0
    }

    return { request_pokemon_count, set_dex_size, request_pokemon_consecutive, pokedex_buffer_assign, display_cards_update, get_pokedex, get_display_cards, scroll_update_positions, display_cards_check_empty}
})