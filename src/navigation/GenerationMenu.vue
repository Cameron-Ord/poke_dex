<script setup lang="ts">
import { poke_data } from '../store';
import type { Generation_Entry } from '../types';


const store = poke_data()

const gen_button_run = (item: Generation_Entry) => {
    const pagination = item.api_pagination
    store.gen_set_body_data(store.api_fetch_gen_data(pagination.url))
}

</script>

<template>
    <div class="child">
        <h1 class="button" v-for="item in store.get_gen_data" @click="gen_button_run(item)">{{ item.api_pagination.name }}</h1>
    </div>
</template>

<style scoped>
</style>