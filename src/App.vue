<script setup lang="ts">
import { onMounted} from 'vue';
import { dex_requests } from './poke_requests.ts';
import PokemonImage from './components/PokemonImage.vue';
import PokemonStats from './components/PokemonStats.vue';
import PokemonTypes from './components/PokemonTypes.vue';
const reqs = dex_requests()

onMounted(async ()=>{
    await reqs.load_pokemon_names()
})

</script>

<template>
    <div class="main width_100">
        <div class="width_90 height_90 center_grid generic_pad_8px rounded_border_5px grid_flow_col">
            <PokemonImage />
            <div class="start_grid spacer generic_pad_8px">
                <PokemonTypes />
                <PokemonStats />                
            </div>
        </div>
    </div>
</template>
