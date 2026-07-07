<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { Pokemon_Information_Generic } from '../types';
import { dex_requests } from '../poke_requests';
import { dex_state } from '../pokedex_state';

const state = dex_state()
const reqs = dex_requests()
const poke_info = ref<Pokemon_Information_Generic | undefined>(undefined)

type artwork_type = "front_default" | "front_shiny"
const current_artwork = ref<artwork_type>("front_default")

const img_loaded = ref<boolean>(false)

watch(()=>state.get_index.value, async ()=>{
    img_loaded.value = false
    poke_info.value = await reqs.pokemon_info_from_index(state.get_index.value)
})

function on_load(){
    img_loaded.value = true
}

async function scroll_update(ev: WheelEvent) {
    const direction: number = ev.deltaY > 0 ? 1 : -1
    state.dex_increment(direction, reqs.pokemon_count)
}

function play_cry(){
    if(poke_info.value){
        const audio = new Audio(poke_info.value.cries.latest)
        audio.currentTime = 0
        audio.play()
    }
}

function default_sprite(){
    current_artwork.value = "front_default"
}

function display_shiny(){
    current_artwork.value = "front_shiny"
}

onMounted(async ()=>{
    await reqs.load_pokemon_names()
    poke_info.value = await reqs.pokemon_info_from_index(state.get_index.value)
})

</script>
<template>
    <div @wheel.prevent="scroll_update($event)" " class="center_grid spacer generic_pad_8px rounded_border_5px" v-if="poke_info">
        <h2 :class="{ loaded: img_loaded }" class="yellow rounded_border_5px text_padding"> {{ poke_info.name }}</h2>
        <img :class="{ loaded: img_loaded }" @load="on_load()" class="unloaded transition_all transition_linear transition_25ms width_100 width_max_256px generic_pad_8px" :src="poke_info.official_artwork_urls[current_artwork]" alt="" @mouseenter="display_shiny()" @mouseleave="default_sprite()">
        <svg @click="play_cry()"
        class="width_max_64px width_100 fill_color generic_pad_8px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        >
        <path d="M15 12.3301L9 16.6603L9 8L15 12.3301Z" fill="currentColor" />
        </svg>
    </div>
</template>