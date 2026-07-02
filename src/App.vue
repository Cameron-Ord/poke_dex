<script setup lang="ts">
import { onMounted } from 'vue';
import { poke_data } from './store';

import GenerationMenu from './navigation/GenerationMenu.vue';

const store = poke_data()

onMounted(()=>{
    store.api_fetch_gens()
})

</script>

<template>
    <div>
        <GenerationMenu />
    </div>
</template>
