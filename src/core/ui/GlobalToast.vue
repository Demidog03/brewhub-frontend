<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification.store';
import { storeToRefs } from 'pinia';
import { Toast, useToast } from 'primevue';
import { watch } from 'vue';

const toast = useToast()
const store = useNotificationStore()
const { queue } = storeToRefs(store) // возвращаем реактивность переменной

watch(
    () => queue.value.length,
    (length) => {
        if (length > 0) {
            for (const message of store.drain()) {
                toast.add(message) // отображаем каждое уведомление
            }
        }
    }
)
</script>

<template>
    <Toast position="top-right" />
</template>