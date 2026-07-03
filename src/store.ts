import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { type Pokedex, type Dex_Entry, type Paginator_Entry, type Generation_Paginator, type Generation_Paginator_Body } from "./types";

import axios from 'axios';

export const poke_data = defineStore('poke_data', ()=> {
    const api_base_url: string = "https://pokeapi.co/api/v2/"
    const endpoint_gen: string = "generation"
    const endpoint_pokemon: string = "pokemon"

    const DEX_MAX_DISPLAY = 3
    const DEX_BUFFER_MAX = 12
    
    const GET_DISP_MAX = computed(()=>DEX_MAX_DISPLAY)
    const GET_DEX_BUFF_MAX = computed(()=>DEX_BUFFER_MAX)

    const pokedex = ref<Pokedex>()
    const get_pokedex = computed(()=>pokedex)

    const api_has_error = ref<boolean>(false)

    const gen_api_pages = ref<Generation_Paginator[]>([])
    const get_gen_pages = computed(() => gen_api_pages.value)

    // Sliding window buffer
    const dex_entry_buffer = ref<Dex_Entry[]>()

    const gen_id_to_index = (given_id: number): number => {
        const generations: number = gen_api_pages.value.length
        for(let i = 0, j = 1; i < generations && j <= generations; i++, j++){
            const current: number = j
            if(given_id == current){
                return i
            }
        }
        return -1
    }

    const gen_name_to_index = (given_name: string): number => {
        const generations: number = gen_api_pages.value.length
        for(let i = 0; i < generations; i++){
            const current = gen_api_pages.value[i].head.name
            if(given_name.toLowerCase() == current.toLowerCase()){
                return i
            }
        }
        return -1
    }

    const zeroed_gen_paginator = (): Generation_Paginator => ({
        head: zeroed_entry(),
        body: zeroed_gen_paginator_body()
    })

    const gen_paginator_body_from = (_id: number, _region: Paginator_Entry, _moves: Paginator_Entry[], _species: Paginator_Entry[], _types: Paginator_Entry[], _versions: Paginator_Entry[]): Generation_Paginator_Body => ({
        id: _id,
        region: _region,
        moves: _moves,
        species: _species,
        types: _types,
        versions: _versions,
    })

    const zeroed_gen_paginator_body = (): Generation_Paginator_Body => ({
        id: -1,
        region: zeroed_entry(),
        moves: [],
        species: [],
        types: [],
        versions: [],
    })

    const zeroed_entry = (): Paginator_Entry => ({
        name: "",
        url: ""
    })

    
    const gen_paginator_set_heads = async (unresolved: Promise<null | Paginator_Entry[]>): Promise<void> => {
        const heads = await unresolved
        if(!heads) {
            console.error("Promise returned NULL!")
            return
        }

        const generations: number = heads.length
        let tmp: Generation_Paginator[] = []
        for(let generation = 0; generation < generations; generation++){
            tmp.push(zeroed_gen_paginator())
        }

        for(let i = 0; i < generations; i++){
            tmp[i].head = heads[i]
        }

        gen_api_pages.value = tmp
    }

    const gen_paginator_set_body = async (unresolved: Promise<null | Generation_Paginator_Body>): Promise<void> => {
        const body = await unresolved
        if(!body){
            console.error("Promise returned NULL!")
            return
        }

        const generation: number = gen_id_to_index(body.id)
        const generations: number = gen_api_pages.value.length
        if(generation < 0 || generation >= generations){
            return
        }

        gen_api_pages.value[generation].body = body
    }
    
    const request_gen_paginator_body = async (endpoint: string): Promise<null | Generation_Paginator_Body> => {
        try {
            const resp = await axios.get(endpoint)
            
            const gen_id: number = resp.data["id"]
            const region: Paginator_Entry = resp.data["main_region"]
            const moves: Paginator_Entry[] = resp.data["moves"]
            const species: Paginator_Entry[] = resp.data["pokemon_species"]
            const types: Paginator_Entry[] = resp.data["types"]
            const versions: Paginator_Entry[] = resp.data["version_groups"]

            return gen_paginator_body_from(gen_id, region, moves, species, types, versions)
        } catch (error) {
            api_has_error.value = true
            console.error(error)
        } finally {
            console.log("Generations data finished fetching")
        }
        return null
    }

    const request_gen_paginator_head = async (): Promise<null | Paginator_Entry[]> => {
        const endpoint: string = api_base_url + endpoint_gen
        try {
            const resp = await axios.get(endpoint)
            return resp.data['results']
        } catch (error) {
            api_has_error.value = true
            console.error(error)
        } finally {
            console.log("Generations pagination finished fetching")
        }
        return null
    }

    return { request_gen_paginator_head, gen_paginator_set_heads, request_gen_paginator_body, gen_paginator_set_body, gen_id_to_index, get_gen_pages }
})