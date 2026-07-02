import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Entry, Pokemon_Data } from "./types";

import axios from 'axios';

export const poke_data = defineStore('poke_data', ()=> {
    const api_has_error = ref<boolean>(false)

    const api_base_url: string = "https://pokeapi.co/api/v2/"
    const endpoint_gen: string = "generation"

    const generations = ref<Entry[]>(Array<Entry>(0))
    // This will get filled through subsecquent calls to the API, effectively caching information,
    // so that I don't need to make more calls to the API if the person using the site has 
    // already navigated/viewed other things.
    const pokemon = ref<Pokemon_Data[]>(Array<Pokemon_Data>(0))

    const get_gen_list = computed(() => generations.value)

    const api_fetch_gens = async () => {
        const endpoint: string = api_base_url + endpoint_gen
        try {
            const resp = await axios.get(endpoint)
            const results: Entry[] = resp.data["results"]
            generations.value = results
        } catch (err) {
            api_has_error.value = true
            console.error(err)
        } finally {
            console.log("Generations finished fetching")
        }
    }

    return { api_fetch_gens, get_gen_list }
})