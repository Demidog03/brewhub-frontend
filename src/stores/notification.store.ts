import { defineStore } from "pinia";
import type { ToastMessageOptions } from "primevue";
import { ref } from "vue";

export const useNotificationStore = defineStore('notification', () => {
    const queue = ref<ToastMessageOptions[]>([])

    function notify(message: ToastMessageOptions) {
        queue.value.push(message)
    }

    function drain() {
        const messages = queue.value
        queue.value = []
        return messages
    }

    function error(detail: string, summary = 'Error') {
        notify({ severity: 'error', summary, detail, life: 5000 })
    }

    function success(detail: string, summary = 'Success') {
        notify({ severity: 'success', summary, detail, life: 3000 })
    }

    function info(detail: string, summary = 'Info') {
        notify({ severity: 'info', summary, detail, life: 3000 })
    }

    return { queue, notify, drain, success, error, }
})