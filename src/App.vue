<script setup lang="ts">
import { onMounted, onBeforeMount } from 'vue';
import { dex_requests } from './poke_requests.ts';

const state = dex_requests()

onMounted(async ()=>{
})

</script>

<template>
    <div class="main width_100">
        <div class="width_90 height_90 grid_cols_start_third container_bg center_grid generic_pad_8px sky_border_2px rounded_border_5px grid_flow_col">
           
        </div>
    </div>
</template>
