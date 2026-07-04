<script setup lang="ts">
import { dex_state } from '../pokedex_state';
import { onMounted, ref, watch } from 'vue';
import { type Dex_Entry } from '../types';

const state = dex_state()
const cards = state.get_display_cards


</script>

<template>
    <div class="card_box">
        <div class="poke_container">
            <p>{{ cards.prev.name }}</p>
            <img :src="cards.prev.sprite" alt="">
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