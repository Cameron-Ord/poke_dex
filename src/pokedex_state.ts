import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { type Pokedex, type Dex_Entry, type Paginator_Entry, } from "./types";

import axios from 'axios';

export const poke_data = defineStore('poke_data', ()=> {
    const api_base_url: string = "https://pokeapi.co/api/v2/pokemon"

    const DEX_MAX_DISPLAY = 3
    const DEX_BUFFER_MAX = 12
    
    const GET_DISP_MAX = computed(()=>DEX_MAX_DISPLAY)
    const GET_DEX_BUFF_MAX = computed(()=>DEX_BUFFER_MAX)

    const pokedex = ref<Pokedex>()
    const get_pokedex = computed(()=>pokedex)

    const api_has_error = ref<boolean>(false)


    return {  }
})