import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Entry, Generation_Paginator, Generation_Paginator_Body } from "./types";

import axios from 'axios';

export const poke_data = defineStore('poke_data', ()=> {
    const api_has_error = ref<boolean>(false)

    const api_base_url: string = "https://pokeapi.co/api/v2/"
    const endpoint_gen: string = "generation"

    const gen_api_pages = ref<Generation_Paginator[]>([])
    const get_gen_pages = computed(() => gen_api_pages.value)

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

    const gen_paginator_body_from = (_id: number, _region: Entry, _moves: Entry[], _species: Entry[], _types: Entry[], _versions: Entry[]): Generation_Paginator_Body => ({
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

    const zeroed_entry = (): Entry => ({
        name: "",
        url: ""
    })

    
    const gen_paginator_set_heads = async (unresolved: Promise<null | Entry[]>): Promise<void> => {
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

        console.log(body.id)
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
            const region: Entry = resp.data["main_region"]
            const moves: Entry[] = resp.data["moves"]
            const species: Entry[] = resp.data["pokemon_species"]
            const types: Entry[] = resp.data["types"]
            const versions: Entry[] = resp.data["version_groups"]

            return gen_paginator_body_from(gen_id, region, moves, species, types, versions)
        } catch (error) {
            api_has_error.value = true
            console.error(error)
        } finally {
            console.log("Generations data finished fetching")
        }
        return null
    }

    const request_gen_paginator_head = async (): Promise<null | Entry[]> => {
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