<script setup lang="ts">
import TestSlotComponent from '@/core/ui/TestSlotComponent.vue';
import { Button } from 'primevue';

</script>

<template>
  <TestSlotComponent>
    <template #main>
      <p>Login page main</p>
    </template>
    <template #footer>
      <p>Login page footer</p>
      <Button>Hello footer</Button>
    </template>
  </TestSlotComponent>
</template>

<style scoped></style>
