<script setup lang="ts">
import { onMounted } from 'vue';
import { poke_data } from './store';

import GenerationMenu from './navigation/GenerationMenu.vue';

const store = poke_data()

onMounted(()=>{
    store.gen_fill_pagination(store.api_fetch_gen_pagination())
})

</script>

<template>
    <div class="main">
        <GenerationMenu />
    </div>
</template>
