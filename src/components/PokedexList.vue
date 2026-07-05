<script setup lang="ts">
import { dex_state } from '../pokedex_state';
import { onMounted, ref, watch } from 'vue';
import { WHEEL_STATES, type Dex_Entry } from '../types';

const state = dex_state()
const cards = state.get_display_cards

type load_key = 'prev' | 'current' | 'next'
const img_loaded = ref<{prev: boolean, current: boolean, next: boolean}>({
    prev: false,
    current: false,
    next: false
})

let scrolling: WHEEL_STATES = WHEEL_STATES.WHEEL_RESTING
let timeout_id: number | undefined = undefined

watch(()=>cards.prev, ()=>{
    img_loaded.value.prev = false
})

watch(()=>cards.current, ()=>{
    img_loaded.value.current = false
})

watch(()=>cards.next, ()=>{
    img_loaded.value.next = false
})

function on_load(key: load_key) {
    img_loaded.value[key] = true
}

async function on_wheel(ev: WheelEvent) {
    const direction: number = ev.deltaY > 0 ? 1 : -1
    await state.scroll_update_positions(direction)
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
    <div class="parent spacer" @wheel.prevent="on_wheel($event)">
        <div :class="{ loaded: img_loaded.prev }" class="box_blur transition_opacity transition_linear transition_25ms unloaded spacer parent poke_container text_align_centered sprite_box green_border_2px rounded_border_5px" v-if="!cards.prev.empty">
            <img :class="{ loaded: img_loaded.prev }"  @load="on_load('prev')" :src="cards.prev.sprite" class="transition_delay_25ms transition_opacity transition_linear transition_50ms unloaded padding_row_4px img_width_max_176px" alt="">
        </div>
        <div :class="{ loaded: img_loaded.current }" class="transition_opacity transition_linear  transition_25ms unloaded padding_row_8px spacer parent poke_container text_align_centered current_sprite_box sky_border_2px rounded_border_5px" v-if="!cards.current.empty">
            <img :class="{ loaded: img_loaded.current }" @load="on_load('current')" :src="cards.current.sprite" class="transition_delay_25ms transition_opacity transition_linear transition_50ms unloaded generic_pad_4px img_width_max_256px" alt="">
            <h2 :class="{ loaded: img_loaded.current }" class="transition_delay_25ms transition_opacity transition_linear transition_75ms unloaded pokemon_name_badge">{{ cards.current.name }}</h2>
        </div>
        <div :class="{ loaded: img_loaded.next }" class="box_blur transition_opacity transition_linear transition_25ms unloaded spacer parent poke_container text_align_centered sprite_box green_border_2px rounded_border_5px" v-if="!cards.next.empty">
            <img :class="{ loaded: img_loaded.next }" @load="on_load('next')" :src="cards.next.sprite" class="transition_delay_25ms transition_opacity transition_linear transition_50ms unloaded padding_row_4px img_width_max_176px" alt="">
        </div>
    </div>
</template>