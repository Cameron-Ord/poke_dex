<script setup lang="ts">
import { onMounted, onBeforeMount } from 'vue';
import { dex_state } from './pokedex_state.ts';

import PokedexList from './cards/PokedexList.vue';

const state = dex_state()

async function on_page_load() {
    await state.set_dex_size(state.request_pokemon_count())
    await state.pokedex_buffer_assign(state.request_pokemon_consecutive())
    await state.display_cards_update()
}

onBeforeMount(()=>{
    
})

onMounted(()=>{
    on_page_load()
})

</script>

<template>
    <div class="main"">
        <PokedexList />
    </div>
</template>
