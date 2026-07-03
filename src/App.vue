<script setup lang="ts">
import { onMounted, onBeforeMount } from 'vue';
import { poke_data } from './store';

import GenerationMenu from './navigation/GenerationMenu.vue';
import PokedexList from './cards/PokedexList.vue';

const store = poke_data()

onBeforeMount(()=>{
    
})

onMounted(()=>{
    store.gen_paginator_set_heads(store.request_gen_paginator_head())
})

</script>

<template>
    <div class="main">
        <GenerationMenu />
        <div v-if="store.get_gen_pages.length > 0"> 

            <PokedexList />

        </div>
        
    </div>
</template>
