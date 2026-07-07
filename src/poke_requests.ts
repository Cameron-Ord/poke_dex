import { defineStore } from "pinia";
import { computed, ref } from "vue";
import axios from 'axios';
import type { Pokemon_Information_Generic, Pokemon_Cry, Pokemon_Type, Pokemon_Artwork, Pokemon_Ability, Pokemon_Stat } from "./types";
import type { Destructured, Artwork_Urls, Cry_Urls, Held_Item_Object, Pokemon_Move_Object, Name_Pair, Ability_Object, Stat_Object, Type_Object } from "./api_types";
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

    let pokemon_names: string[] = []
    const pokemon_count = computed(()=>pokemon_names.length)
    let loading: Promise<void> | null = null

    async function pokemon_info_from_index(index: number): Promise<Pokemon_Information_Generic | undefined> {
        const pokemon_name: string | undefined = pokemon_names.at(index)
        if(!pokemon_name){
            return undefined
        }

        return retrieve_pokemon_info(pokemon_name)
    }

    async function load_pokemon_names() {
        if(pokemon_names.length > 0){
            return
        }

        if(!loading){
            loading = fill_pokemon_names_list(await get_page_count(keys.pokemon_key))
        }

        await loading
    }

    // Pokemon name, Info
    const pokemon_info_generic = ref(new Map<string, Pokemon_Information_Generic>())

    async function fill_pokemon_names_list(count: number) {
        const endpoint: string | undefined = api_endpoints.get(keys.pokemon_key)
        if(!endpoint){
            console.error("bad key")
            return
        }

        const data: Destructured | null = await page_request(endpoint, count, 0)
        if(!data){
            return
        } 

        pokemon_names = []
        const results: Name_Pair[] = data['results']
        for(let i = 0; i < results.length; i++){
            pokemon_names.push(results[i].name)
        }
    }

    async function retrieve_pokemon_info(pokemon_name: string): Promise<Pokemon_Information_Generic | undefined> {
        if(pokemon_info_generic.value.has(pokemon_name)){
            return pokemon_info_generic.value.get(pokemon_name)
        } else {
            const inserted: Pokemon_Information_Generic | null = pokemon_info_map_insert(await pokemon_request(pokemon_name))
            if(!inserted){
                return undefined
            } else {
                return inserted
            }
        }
    }

    async function get_page_count(key: string): Promise<number> {
        const endpoint: string | undefined = api_endpoints.get(key)
        if(!endpoint){
            console.error("bad key")
            return 0
        }
        const data: Destructured | null = await page_request(endpoint, 1, 0)
        if(!data){
            return 0
        }
        return data.count
    }

    function move_data_transform(move_data_list: Pokemon_Move_Object[]): string[] {
        let tmp: string[] = []
        for(let i = 0; i < move_data_list.length; i++){
            const move_name: string = move_data_list[i].move.name
            tmp.push(move_name)
        }
        return tmp
    }

    function cries_data_transform(cries: Cry_Urls): Pokemon_Cry{
        return cries
    }

    function held_items_data_transform(held_items_list: Held_Item_Object[]): string[] {
        let held_items: string[] = []
        for(let i = 0; i < held_items_list.length; i++){
            held_items.push(held_items_list[i].item.name)
        }
        return held_items
    }

    function artwork_data_transform(artwork: Artwork_Urls): Pokemon_Artwork {
        return artwork
    }

    function ability_data_transform(abilities_list: Ability_Object[]) {
        let tmp: Pokemon_Ability[] = []
        for(let i = 0; i < abilities_list.length; i++){
            tmp.push({name: abilities_list[i].ability.name, is_hidden: abilities_list[i].is_hidden, slot: abilities_list[i].slot})
        }
        return tmp
    }

    function stat_data_transform(stats_list: Stat_Object[]): Pokemon_Stat[] {
        let tmp: Pokemon_Stat[] = []
        for(let i = 0; i < stats_list.length; i++){
            tmp.push({name: stats_list[i].stat.name, value: stats_list[i].base_stat})
        }
        return tmp
    }

    function type_data_transform(type_list: Type_Object[]): Pokemon_Type[] {
        let tmp: Pokemon_Type[] = []
        for(let i = 0; i < type_list.length; i++){
            tmp.push({name: type_list[i].type.name, slot: type_list[i].slot})
        }
        return tmp
    }

    
    function pokemon_info_map_insert(pokemon_info: Pokemon_Information_Generic | null): Pokemon_Information_Generic | null {
        if(!pokemon_info){
            return null
        }

        try {
            pokemon_info_generic.value.set(pokemon_info.name, pokemon_info)
            return pokemon_info
        } catch (error) {
            console.log(error)
        }
        return null
    }

    async function pokemon_request(pokemon_name: string): Promise<Pokemon_Information_Generic | null> {
        const base: string | undefined = api_endpoints.get(keys.pokemon_key)
        if(!base){
            return null
        }
        const endpoint: string = `${base}/${pokemon_name}`

        try {
            const response = await axios.get(endpoint)
            const data = response['data']
            return {
                name: data['name'],
                base_experience: data['base_experience'],
                cries: cries_data_transform(data['cries']),
                height: data['height'],
                weight: data['weight'],
                held_items: held_items_data_transform(data['held_items']),
                move_names: move_data_transform(data['moves']),
                official_artwork_urls: artwork_data_transform(data['sprites']['other']['official-artwork']),
                abilities: ability_data_transform(data['abilities']),
                stats: stat_data_transform(data['stats']),
                type: type_data_transform(data['types'])
            }
        } catch (error) {
            console.error(error)
        }
        return null
    }

    async function page_request(endpoint: string, req_limit: number, req_offset: number): Promise<Destructured | null> {
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

        const data: Destructured | null = await page_request(endpoint, req_limit, req_offset)
        if(!data){
            return
        }


        if(!api_pages.has(key)){
            let map: Map<string, string> | undefined = api_pages.get(key)
            if(!map){
                console.error("bad key")
                return
            }

            const results: Name_Pair[] = data['results']
            for(let i = 0; i < results.length; i++){
                map.set(results[i].name, results[i].url)
            }

            api_pages.set(key, map)
            
        }
    }

    
    return { keys, pokemon_count, load_pokemon_names, pokemon_info_from_index, request_pages, fill_pokemon_names_list, get_page_count, retrieve_pokemon_info }

})
