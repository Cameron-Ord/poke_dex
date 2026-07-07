<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Pokemon_Information_Generic } from '../types';
import { dex_requests } from '../poke_requests';
import { dex_state } from '../pokedex_state';

const state = dex_state()
const reqs = dex_requests()
const poke_info = ref<Pokemon_Information_Generic | undefined>(undefined)

onMounted(async ()=>{
    await reqs.load_pokemon_names()
    poke_info.value = await reqs.pokemon_info_from_index(state.dex_index)
})

</script>
<template>
    <div class="" v-if="poke_info && poke_info.official_artwork_urls">
        <img v-for="sprite in poke_info.official_artwork_urls" :src="sprite.url" alt="pokemon_sprite">
    </div>
</template>