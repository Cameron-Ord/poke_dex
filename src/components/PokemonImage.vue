<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { Pokemon_Information_Generic } from '../types';
import { dex_requests } from '../poke_requests';
import { dex_state } from '../pokedex_state';

const state = dex_state()
const reqs = dex_requests()
const poke_info = ref<Pokemon_Information_Generic | undefined>(undefined)

type artwork_type = "normal" | "shiny"
const current_artwork = ref<artwork_type>("normal")

const img_loaded = ref<boolean>(false)

watch(()=>state.get_index.value, async ()=>{
    img_loaded.value = false
    poke_info.value = await reqs.pokemon_info_from_index(state.get_index.value)
})

function change_sprite(){
    if(current_artwork.value == "normal"){
        current_artwork.value = "shiny"
    } else {
        current_artwork.value = "normal"
    }
}

function on_load(){
    img_loaded.value = true
}

async function scroll_update(ev: WheelEvent) {
    const direction: number = ev.deltaY > 0 ? 1 : -1
    state.dex_increment(direction, reqs.pokemon_count)
}

function play_cry(){
    if(poke_info.value){
        const audio = new Audio(poke_info.value.cries[0].url)
        audio.currentTime = 0
        audio.play()
    }
}

onMounted(async ()=>{
    await reqs.load_pokemon_names()
    poke_info.value = await reqs.pokemon_info_from_index(state.get_index.value)
})

</script>
<template>
    <div @wheel.prevent="scroll_update($event)" " class="center_grid spacer generic_pad_8px rounded_border_5px" v-if="poke_info">
        <h2 :class="{ loaded: img_loaded }" class="yellow rounded_border_5px text_padding"> {{ poke_info.name }}</h2>
        <img :class="{ loaded: img_loaded }" @load="on_load()" class="unloaded transition_all transition_linear transition_25ms width_100 width_max_256px" :src="poke_info.official_artwork_urls[current_artwork]" alt="" @click="change_sprite()">
    </div>
</template>