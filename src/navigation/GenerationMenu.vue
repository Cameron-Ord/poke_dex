<script setup lang="ts">
import { poke_data } from '../store';
const store = poke_data()

</script>

<template>
    <div class="child">
        <h1 class="button" v-for="item in store.get_gen_list">{{ item.generation.name }}</h1>
    </div>
</template>

<style scoped>
</style>