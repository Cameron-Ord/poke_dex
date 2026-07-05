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

</script>

<template>
    <div class="main">
        <div class="grid_cols_start_third container center_grid generic_pad_8px sky_border_2px rounded_border_5px grid_flow_col">
            <div class="generic_pad_8px center_grid spacer" @wheel.prevent="on_wheel($event)">
                <UnfocusedEntry :card="state.get_display_cards.prev" />
                <FocusedEntry :card="state.get_display_cards.current" />
                <UnfocusedEntry :card="state.get_display_cards.next" />
            </div>
            <div class="center_grid spacer">asdasdsad</div>
        </div>
    </div>
</template>
