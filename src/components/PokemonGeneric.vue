<script setup lang="ts">
import { onMounted, ref, watch} from 'vue';
import { dex_state } from '../pokedex_state';
import { dex_requests } from '../poke_requests.ts';
import type { Pokemon_Information_Generic } from '../types';

const reqs = dex_requests()
const state = dex_state()

const poke_info = ref<Pokemon_Information_Generic | undefined>(undefined)

watch(()=>state.get_index.value, async ()=>{
    poke_info.value = await reqs.pokemon_info_from_index(state.get_index.value)
})

onMounted(async ()=>{
    await reqs.load_pokemon_names()
    poke_info.value = await reqs.pokemon_info_from_index(state.get_index.value)
})

</script>

<template>
    <div class="spacer start_grid rounded_border_5px" v-if="poke_info">
        <div class="spacer start_grid rounded_border_5px grid_flow_col">
            <p class="text_padding rounded_border_5px green">experience </p>
            <p class="text_padding border_1px rounded_border_5px yellow" >{{ poke_info.base_experience }}</p>
        </div>
        <div class="spacer start_grid rounded_border_5px grid_flow_col">
            <p class="text_padding rounded_border_5px green">weight </p>
            <p class="text_padding border_1px rounded_border_5px yellow" >{{ poke_info.weight }}</p>
        </div>
        <div class="spacer start_grid rounded_border_5px grid_flow_col">
            <p class="text_padding rounded_border_5px green">height</p>
            <p class="text_padding border_1px rounded_border_5px yellow" >{{ poke_info.height }}</p>
        </div>
        <div class="spacer start_grid rounded_border_5px grid_flow_col">
            <p class="text_padding rounded_border_5px green">move count</p>
            <p class="text_padding border_1px rounded_border_5px yellow" >{{ poke_info.move_names.length }}</p>
        </div>
        <div class="spacer start_grid rounded_border_5px grid_flow_col">
            <p class="text_padding rounded_border_5px green">ability count</p>
            <p class="text_padding border_1px rounded_border_5px yellow" >{{ poke_info.abilities.length }}</p>
        </div>
        <div class="spacer start_grid rounded_border_5px grid_flow_col">
            <p class="text_padding rounded_border_5px green">held item count</p>
            <p class="text_padding border_1px rounded_border_5px yellow" >{{ poke_info.held_items.length }}</p>
        </div>        
    </div>
</template>