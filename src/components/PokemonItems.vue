<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { Pokemon_Information_Generic } from '../types';
import { dex_requests } from '../poke_requests';
import { dex_state } from '../pokedex_state';

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

</script>
<template>
    <div class="start_grid spacer rounded_border_5px">
        <p class="text_padding border_1px rounded_border_5px yellow" v-if="poke_info" v-for="item in poke_info.held_items"> {{ item }}</p>
    </div>
</template>