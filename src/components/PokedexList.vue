<script setup lang="ts">
import { dex_state } from '../pokedex_state';
import { onMounted, ref, watch } from 'vue';
import { type Dex_Entry } from '../types';

const state = dex_state()
const cards = state.get_display_cards

type load_key = 'prev' | 'current' | 'next'
const img_loaded = ref<{prev: boolean, current: boolean, next: boolean}>({
    prev: false,
    current: false,
    next: false
})

watch(()=>cards.prev, ()=>{
    img_loaded.value.prev = false
})

watch(()=>cards.current, ()=>{
    img_loaded.value.current = false
})

watch(()=>cards.next, ()=>{
    img_loaded.value.next = false
})

async function card_scroll(ev: WheelEvent) {
    const direction: number = ev.deltaY > 0 ? 1 : -1
    if(state.scroll_update_positions(direction)){
        await state.pokedex_buffer_assign(state.request_pokemon_consecutive())
        await state.display_cards_check_empty(state.display_cards_update())
    } else {
        await state.display_cards_check_empty(state.display_cards_update())
    }
}

function on_load(key: load_key) {
    img_loaded.value[key] = true
}

</script>

<style scoped>
.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from{
  opacity: 0;
}
</style>

<template>
    <div class="parent spacer" @wheel.prevent="card_scroll($event)">
        <div class="container_width_max spacer parent poke_container text_align_centered " v-if="!cards.prev.empty">
            <img :class="{ loaded: img_loaded.prev }"  @load="on_load('prev')" :src="cards.prev.sprite" class="padding_row_4px unloaded img_width_max_176px sprite_box green_border_2px rounded_border_5px" alt="">
        </div>
        <div class="padding_row_8px container_width_max spacer parent poke_container text_align_centered current_sprite_box sky_border_2px rounded_border_5px" v-if="!cards.current.empty">
            <img :class="{ loaded: img_loaded.current }" @load="on_load('current')" :src="cards.current.sprite" class="generic_pad_4px unloaded img_width_max_256px" alt="">
            <h2 class="pokemon_name_badge">{{ cards.current.name }}</h2>
        </div>
        <div class="container_width_max spacer parent poke_container text_align_centered" v-if="!cards.next.empty">
            <img :class="{ loaded: img_loaded.next }" @load="on_load('next')" :src="cards.next.sprite" class="padding_row_4px unloaded img_width_max_176px sprite_box green_border_2px rounded_border_5px" alt="">
        </div>
    </div>
</template>