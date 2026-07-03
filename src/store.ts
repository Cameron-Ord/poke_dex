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

    const zeroed_gen_body = (): Generation_Data => ({
        id: -1,
        moves: [],
        species: [],
        types: [],
        versions: [],
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
                data: zeroed_gen_body()
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

    const api_fetch_gen_data = async (): Promise<null | Generation_Data> => {
        return null
    }

    const api_fetch_gen_pagination = async (): Promise<null | Entry[]> => {
        const endpoint: string = api_base_url + endpoint_gen
        try {
            const resp = await axios.get(endpoint)
            return resp.data['results']
        } catch (err) {
            api_has_error.value = true
            console.error(err)
        } finally {
            console.log("Generations finished fetching")
        }
        return null
    }

    return { get_gen_data, api_fetch_gen_pagination, gen_fill_pagination, api_fetch_gen_data, gen_set_body_data }
})