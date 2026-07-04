import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { CONTROL_FLOW, type Pokedex, type Dex_Entry, type Display_Window } from "./types";

import axios from 'axios';

export const dex_state = defineStore('dex_state', ()=> {
    const api_base_url: string = "https://pokeapi.co/api/v2/pokemon"
    const api_has_error = ref<boolean>(false)

    const DEX_BUFFER_MAX = 48
    const DEX_SHIFT_AMOUNT = 24
    const GET_DEX_BUFF_MAX = computed(()=>DEX_BUFFER_MAX)

    const pokedex = ref<Pokedex>(zeroed_dex())
    const get_pokedex = computed(()=>pokedex)
    const get_display_cards = computed(() =>pokedex.value.display_window)


    function scroll_update(direction: number) {
        switch(pokedex_traverse_query(direction)){
            case CONTROL_FLOW.DEX_SEEK_BACKWARD:{

            } break

            case CONTROL_FLOW.DEX_SEEK_FORWARD: {

            }break

            case CONTROL_FLOW.DEX_SEEK_UNCHANGED: {

            }
        }
    }

    function buffer_update_position(){

    }

    function pokedex_seek_backward(){

    }

    function pokedex_seek_forward(){
        const dex_size: number = pokedex.value.dex_size
        const current_position: number = pokedex.value.dex_position
        const next_position: number = pokedex.value.dex_position + DEX_SHIFT_AMOUNT
        
    }

    function pokedex_traverse_query(direction: number): number {
        const current = pokedex.value.buffer_position
        const buflen = pokedex.value.buffer.length

        if(current + direction < 0){
            return CONTROL_FLOW.DEX_SEEK_BACKWARD
        } else if (current + direction >= buflen){
            return CONTROL_FLOW.DEX_SEEK_FORWARD
        } else {
            return CONTROL_FLOW.DEX_SEEK_UNCHANGED
        }
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
            base_exp: 0
        }
    }

    function zeroed_dex(): Pokedex {
        return {
            dex_position: 0,
            dex_size: 0,
            buffer: Array.from({ length: DEX_BUFFER_MAX }, () => zeroed_entry()),
            buffer_position: 0,
            display_window: zeroed_display_window()
        }
    }

    async function set_dex_size(unresolved: Promise<number>): Promise<void> {
        const new_size: number = await unresolved
        pokedex.value.dex_size = new_size
        return
    }

    async function display_cards_update(): Promise<void> {
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

    }

    async function pokedex_buffer_assign(unresolved: Promise<Dex_Entry[]>): Promise<void> {
        const requested_pokemon: Dex_Entry[] = await unresolved
        let current_pokemon: Dex_Entry[] = pokedex.value.buffer

        current_pokemon.length = requested_pokemon.length
        if(current_pokemon.length > DEX_BUFFER_MAX) {
            current_pokemon.length = DEX_BUFFER_MAX
            requested_pokemon.length = DEX_BUFFER_MAX
        }

        for(let i = 0; i < current_pokemon.length && i < requested_pokemon.length; i++){
            current_pokemon[i] = requested_pokemon[i]
        }   
    }

    async function request_pokemon_consecutive(): Promise<Dex_Entry[]> {
        const dex_size: number = pokedex.value.dex_size

        let tmp: Dex_Entry[] = []
        for(let i = 1; i <= DEX_BUFFER_MAX; i++){
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

    async function request_pokemon(endpoint: string): Promise<Dex_Entry>  {
        try {
            const resp = await axios.get(endpoint)
            const data = resp['data']
            return {
                id: data['id'] || 0,
                name: data['name'] || "",
                sprite: data['sprites']['front_default'] || "",
                cry: data['cries']['legacy'] || "",
                height: data['height'] || 0,
                weight: data['weight'] || 0,
                base_exp: data['base_experience'] || 0
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

    return { request_pokemon_count, set_dex_size, request_pokemon_consecutive, pokedex_buffer_assign, display_cards_update, get_pokedex, get_display_cards, increment_buffer_position }
})