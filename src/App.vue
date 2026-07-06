<script setup lang="ts">
import { onMounted, onBeforeMount } from 'vue';
import { dex_state } from './pokedex_state.ts';

import FocusedEntry from './components/FocusedEntry.vue';
import UnfocusedEntry from './components/UnfocusedEntry.vue';
const state = dex_state()

async function on_page_load() {
    await state.set_dex_size(state.request_pokemon_count())
    await state.pokedex_buffer_assign(state.request_pokemon_consecutive())
    await state.display_cards_update()

}

async function on_wheel(ev: WheelEvent) {
    const direction: number = ev.deltaY > 0 ? 1 : -1
    await state.scroll_update_positions(direction)
}

onMounted(async ()=>{
    await on_page_load()
})

async function pokecry(){
    const audio = new Audio(state.get_display_cards.current.cry)
    try {
        await audio.play()
    } catch (err){
        console.error(err)
    }
}

</script>

<template>
    <div class="main width_100">
        <div class="width_90 height_90 grid_cols_start_third container_bg center_grid generic_pad_8px sky_border_2px rounded_border_5px grid_flow_col">
            <div class="width_90 generic_pad_8px center_grid spacer" @wheel.prevent="on_wheel($event)">
                <UnfocusedEntry :card="state.get_display_cards.prev" />
                <FocusedEntry :card="state.get_display_cards.current" />
                <UnfocusedEntry :card="state.get_display_cards.next" />
            </div>
            <div class="width_90 center_grid spacer grid_flow_col">
                <div class="width_80 center_grid spacer grid_flow_row">
                    <p v-for="type in state.get_display_cards.current.types"> {{ type }}</p>
                    <p v-for="stat in state.get_display_cards.current.stats">{{ stat.stat }} {{ stat.base_stat }}</p>

                </div>
            </div>
        </div>
    </div>
</template>
