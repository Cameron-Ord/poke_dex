import { defineStore } from "pinia";
import { ref } from "vue";
import axios from 'axios';
import type { Destructured, Page_Entry } from "./types";
export const dex_requests = defineStore('dex_requests', ()=> {

    const keys = {
        stat_key: "stat",
        type_key: "type",
        ability_key: "ability",
        pokemon_key: "pokemon",
        generation_key: "generation",
    } as const

    const api_endpoints: Map<string, string> = new Map([
        [ keys.pokemon_key, "https://pokeapi.co/api/v2/pokemon"],
        [ keys.generation_key, "https://pokeapi.co/api/v2/generation"],
        [ keys.type_key, "https://pokeapi.co/api/v2/type"],
        [ keys.stat_key, "https://pokeapi.co/api/v2/stat"],
        [ keys.ability_key, "https://pokeapi.co/api/v2/ability"],
    ])

    const api_pages: Map<string, Map<string, string>> = new Map([
        [ keys.type_key, new Map<string, string>() ],
        [ keys.stat_key, new Map<string, string>() ],
        [ keys.ability_key, new Map<string, string>() ],
        [ keys.pokemon_key, new Map<string, string>() ],
    ])

    async function get_page_count(key: string): Promise<number> {
        const endpoint: string | undefined = api_endpoints.get(key)
        if(!endpoint){
            console.error("bad key")
            return 0
        }
        const data: Destructured | null = await request(endpoint, 1, 0)
        if(!data){
            return 0
        }
        return data.count
    }

    async function request(endpoint: string, req_limit: number, req_offset: number): Promise<Destructured | null> {
        try {
            const response = await axios.get(endpoint, {
                params: {
                    limit: req_limit,
                    offset: req_offset
                }
            })
            const data: Destructured = response['data']
            return data
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async function request_pages(key: string, req_limit: number, req_offset: number): Promise<void> {
        const endpoint: string | undefined = api_endpoints.get(key)
        if(!endpoint){
            console.error("bad key")
            return
        }

        const data: Destructured | null = await request(endpoint, 20, 0)
        if(!data){
            return
        }

        let map: Map<string, string> | undefined = api_pages.get(key)
        if(!map){
            console.error("bad key")
            return
        }

        const results: Page_Entry[] = data['results']
        for(let i = 0; i < results.length; i++){
            map.set(results[i].name, results[i].url)
        }
    }

    
    return { keys, request_pages, get_page_count }

})
