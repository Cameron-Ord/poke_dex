<script setup lang="ts">
import { poke_data } from '../store';
const store = poke_data()

</script>

<template>
    <div>
        <p class="gen_button" v-for="item in store.get_gen_list">{{ item.name }}</p>
    </div>
</template>