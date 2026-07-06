<script setup lang="ts">
import { onMounted, onBeforeMount } from 'vue';
import { dex_requests } from './poke_requests.ts';
import type { Pokemon_Information_Generic } from './types.ts';

const state = dex_requests()

onMounted(async ()=>{
    const pokemon_count: number = await state.get_page_count(state.keys.pokemon_key)
    await state.request_pages(state.keys.pokemon_key, pokemon_count, 0)
})

</script>

<template>
    <div class="main width_100">
        <div class="width_90 height_90 grid_cols_start_third container_bg center_grid generic_pad_8px sky_border_2px rounded_border_5px grid_flow_col">
           
        </div>
    </div>
</template>
