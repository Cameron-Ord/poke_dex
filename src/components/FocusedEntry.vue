<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { Dex_Entry } from '../types';

const img_loaded = ref<boolean>(false)

const props = defineProps<{
    card: Dex_Entry
}>()


watch(()=>props.card, ()=>{
    img_loaded.value = false
})

function on_load() {
    img_loaded.value = true
}

onMounted(async ()=>{
})

</script>
<template>
    <div :class="{ loaded: img_loaded }" class="transition_opacity transition_linear transition_25ms unloaded padding_row_8px spacer center_grid current_sprite_box sky_border_2px rounded_border_5px width_100 img_width_max_256px" v-if="!props.card.empty">
        <img :class="{ loaded: img_loaded }" @load="on_load()" :src="props.card.sprite" class="transition_delay_25ms transition_opacity transition_linear transition_50ms unloaded generic_pad_4px width_90" alt="">
        <p :class="{ loaded: img_loaded }" class="transition_delay_25ms transition_opacity transition_linear transition_75ms unloaded pokemon_name_badge">{{ props.card.name }}</p>
    </div>
</template>