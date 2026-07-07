import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const dex_state = defineStore('dex_state', ()=> {
    let dex_index = ref<number>(0)

    function dex_increment(direction: number, max: number) {
        let next: number = dex_index.value + direction
        if(next > max - 1){
            next = max -1
        } else if (next < 0){
            next = 0
        }
        dex_index.value = next
    }

    const get_index = computed(()=>dex_index)

    return { get_index, dex_increment }
})