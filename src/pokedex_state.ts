import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const dex_state = defineStore('dex_state', ()=> {
    let dex_index = ref<number>(0)

    function dex_increment_const(current: number, direction: number, max: number): number {
        let next: number = current + direction
        if(next > max - 1){
            next = max -1
        } else if (next < 0){
            next = 0
        }
        return next 
    }

    function set_index(i: number, max: number, min: number) {
        if(i < max && i >= 0) {
            dex_index.value = i
        } else if (i > max - 1){
            dex_index.value = max - 1
        } else if(i < 0) {
            dex_index.value = 0
        }
    }

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

    return { get_index, set_index, dex_increment, dex_increment_const }
})