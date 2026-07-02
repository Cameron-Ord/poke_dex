import { defineStore } from "pinia";
import { ref } from "vue";

export const poke_data = defineStore('poke_data', ()=> {
    interface Entry {
        name: string;
        id: number
        gen: number
    }

    const entry_count = ref<number>(0)
    const entry_list = ref<Entry[]>([])

    const get_entries = (): Entry[] => {
        return entry_list.value
    }

    const get_count = (): number => {
        return entry_count.value
    }

    return { get_entries, get_count }
})