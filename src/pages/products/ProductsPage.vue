<script setup lang="ts">
import TestSlotComponent from '@/core/ui/TestSlotComponent.vue';

</script>

<template>
  <TestSlotComponent>
    <template #main>
      <h2>Product page</h2> <!-- попадают в слот -->
    </template>
  </TestSlotComponent>
</template>

<style scoped></style>
