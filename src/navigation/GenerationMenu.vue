<script setup lang="ts">
import { poke_data } from '../store';
import type { Generation_Paginator } from '../types';


const store = poke_data()

const gen_button_run = (item: Generation_Paginator) => {
    const endpoint = item.head.url
    store.gen_paginator_set_body(store.request_gen_paginator_body(endpoint))
}

</script>

<template>
    <div class="child">
        <h1 class="button" v-for="item in store.get_gen_pages" @click="gen_button_run(item)">{{ item.head.name }}</h1>
    </div>
</template>

<style scoped>
</style>