import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Entry, Generation_Data, Generation_Entry } from "./types";

import axios from 'axios';

export const poke_data = defineStore('poke_data', ()=> {
    const api_has_error = ref<boolean>(false)

    const api_base_url: string = "https://pokeapi.co/api/v2/"
    const endpoint_gen: string = "generation"

    const gen_data = ref<Generation_Entry[]>([])
    const get_gen_data = computed(() => gen_data.value)

    const zeroed_gen_data = (): Generation_Data => ({
        id: -1,
        region: zeroed_entry(),
        moves: [],
        species: [],
        types: [],
        versions: [],
    })

    const make_gen_data = (_id: number, _region: Entry, _moves: Entry[], _species: Entry[], _types: Entry[], _versions: Entry[]): Generation_Data => ({
        id: _id,
        region: _region,
        moves: _moves,
        species: _species,
        types: _types,
        versions: _versions,
    })

    const zeroed_entry = (): Entry => ({
        name: "",
        url: ""
    })

    const gen_fill_pagination = async (unresolved: Promise<null | Entry[]>): Promise<void> => {
        const paginate_data = await unresolved
        if(!paginate_data) {
            console.error("Promise returned NULL!")
            return
        }

        const generations: number = paginate_data.length
        let tmp: Generation_Entry[] = []
        for(let i = 0; i < generations; i++){
            const item: Generation_Entry = {
                api_pagination: zeroed_entry(),
                data: zeroed_gen_data()
            }
            tmp.push(item)
        }

        for(let i = 0; i < generations; i++){
            tmp[i].api_pagination = paginate_data[i]
        }

        gen_data.value = tmp
    }

    const gen_set_body_data = async (unresolved: Promise<null | Generation_Data>): Promise<void> => {
        const data = await unresolved
        if(!data){
            console.error("Promise returned NULL!")
            return
        }

        const generation: number = data.id
        const generations: number = gen_data.value.length
        if(generation >= 0 || generation < generations){
            gen_data.value[generation].data = data
        }
    }

    const api_fetch_gen_data = async (endpoint: string): Promise<null | Generation_Data> => {
        try {
            const resp = await axios.get(endpoint)
            
            const gen_id: number = resp.data["id"]
            const region: Entry = resp.data["main_region"]
            const moves: Entry[] = resp.data["moves"]
            const species: Entry[] = resp.data["pokemon_species"]
            const types: Entry[] = resp.data["types"]
            const versions: Entry[] = resp.data["version_groups"]

            return make_gen_data(gen_id, region, moves, species, types, versions)
        } catch (error) {
            api_has_error.value = true
            console.error(error)
        } finally {
            console.log("Generations data finished fetching")
        }
        return null
    }

    const api_fetch_gen_pagination = async (): Promise<null | Entry[]> => {
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

    return { get_gen_data, api_fetch_gen_pagination, gen_fill_pagination, api_fetch_gen_data, gen_set_body_data }
})