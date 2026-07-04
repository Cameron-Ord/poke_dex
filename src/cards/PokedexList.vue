<script setup lang="ts">
import { dex_state } from '../pokedex_state';

const store = dex_state()

</script>

<template>
    <div>
        <p>{{ store.get_display_cards.prev.name }}</p>
        <p>{{ store.get_display_cards.current.name }}</p>
        <p>{{ store.get_display_cards.next.name }}</p>
    </div>
</template>