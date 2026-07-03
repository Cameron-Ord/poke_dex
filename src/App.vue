<script setup lang="ts">
import { onMounted, onBeforeMount } from 'vue';
import { poke_data } from './pokedex_state.ts';

import PokedexList from './cards/PokedexList.vue';

const store = poke_data()

onBeforeMount(()=>{
    
})

onMounted(()=>{
})

</script>

<template>
    <div class="main">
    </div>
</template>
