import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const dex_state = defineStore('dex_state', ()=> {
    let dex_index: number = 0



    return { dex_index,}
})