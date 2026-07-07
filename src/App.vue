<script setup lang="ts">
import { onMounted, onBeforeMount } from 'vue';
import { dex_requests } from './poke_requests.ts';
import type { Pokemon_Information_Generic } from './types.ts';
import PokemonImage from './components/PokemonImage.vue';

const reqs = dex_requests()

onMounted(async ()=>{
    await reqs.load_pokemon_names()
})

</script>

<template>
    <div class="main width_100">
        <div class="width_90 height_90 grid_cols_start_third container_bg center_grid generic_pad_8px sky_border_2px rounded_border_5px grid_flow_col">
        <PokemonImage />
        </div>
    </div>
</template>
