<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { Pokemon_Information_Generic } from './types';
import { dex_state } from './pokedex_state.ts';
import { dex_requests } from './poke_requests.ts';
import PokemonImage from './components/PokemonImage.vue';
import PokemonStats from './components/PokemonStats.vue';
import PokemonTypes from './components/PokemonTypes.vue';
import PokemonTitle from './components/PokemonTitle.vue';
import PokemonGeneric from './components/PokemonGeneric.vue';

import PokemonItems from './components/PokemonItems.vue';
import PokemonAbilities from './components/PokemonAbilities.vue';

const state = dex_state()
const reqs = dex_requests()

const poke_info = ref<Pokemon_Information_Generic | undefined>(undefined)

watch(()=>state.get_index.value, async ()=>{
    poke_info.value = await reqs.pokemon_info_from_index(state.get_index.value)
})

onMounted(async ()=>{
    await reqs.load_pokemon_names()
    poke_info.value = await reqs.pokemon_info_from_index(state.get_index.value)
})

async function scroll_update(ev: WheelEvent) {
    const direction: number = ev.deltaY > 0 ? 1 : -1
    state.dex_increment(direction, reqs.pokemon_count)
}


</script>

<template>
    <div class="main width_100">
        <div @wheel.prevent="scroll_update($event)" class="width_90 height_90 center_grid generic_pad_8px rounded_border_5px grid_templ_col_dual" >
            <PokemonImage />
            <div class="width_90 large_spacer center_grid grid_flow_row">
                <div class="width_100 start_grid spacer grid_templ_col_dual">
                    <div class="width_100 start_grid large_spacer grid_flow_row">
                        <PokemonTitle />
                        <PokemonGeneric />
                    </div>

                    <div class="width_100 start_grid large_spacer">
                        <PokemonTypes />
                        <PokemonStats />   
                    </div>    
                </div>  
                <div class="width_100 start_grid spacer" v-if="poke_info && (poke_info.held_items.length > 0 || poke_info.abilities.length > 0)">
                    <div class="width_100 start_grid spacer grid_templ_col_dual">
                        <PokemonItems />
                        <PokemonAbilities />
                    </div>
                </div>       
            </div>
        </div>
    </div>
</template>
