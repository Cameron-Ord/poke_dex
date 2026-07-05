<script setup lang="ts">
import {  ref, watch } from 'vue';
import type { Dex_Entry } from '../types';

const props = defineProps<{
    card: Dex_Entry
}>()

const img_loaded = ref<boolean>(false)

watch(()=>props.card, ()=>{
    img_loaded.value = false
})

function on_load() {
    img_loaded.value = true
}

</script>
<template>
    <div :class="{ loaded: img_loaded }" class="box_blur transition_opacity transition_linear transition_25ms unloaded spacer parent sprite_box green_border_2px rounded_border_5px width_80" v-if="!props.card.empty">
        <img :class="{ loaded: img_loaded }" @load="on_load()" :src="props.card.sprite" class=" transition_delay_25ms transition_opacity transition_linear transition_50ms unloaded padding_row_4px img_width_max_176px width_90" alt="">
    </div>
</template>