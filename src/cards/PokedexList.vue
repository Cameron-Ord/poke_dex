<script setup lang="ts">
import { dex_state } from '../pokedex_state';
import { onMounted, ref, watch } from 'vue';
import { type Dex_Entry } from '../types';

const state = dex_state()
const cards = state.get_display_cards

async function card_scroll(ev: WheelEvent) {
    const direction: number = ev.deltaY > 0 ? 1 : -1
    console.log(direction)

    if(state.scroll_update_positions(direction)){
        await state.pokedex_buffer_assign(state.request_pokemon_consecutive())
        await state.display_cards_update()
    } else {
        await state.display_cards_update()
    }
}

</script>

<template>
    <div class="card_box" @wheel="card_scroll($event)">
        <div class="poke_container">
            <p>{{ cards.prev.name }}</p>
            <img :src="state.get_display_cards.prev.sprite" alt="">
        </div>
        <div class="poke_container">
            <p>{{ cards.current.name }}</p>
            <img :src="cards.current.sprite" alt="">
        </div>
        <div class="poke_container">
            <p>{{ cards.next.name }}</p>
            <img :src="cards.next.sprite" alt="">
        </div>
    </div>
</template>