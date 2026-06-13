<script setup lang="ts"></script>

<template>
  <h1 style="font-style: italic;">Header: Test Slot Component</h1>
  <div>
    <h2 style="font-style: italic;">Main: </h2>
    <slot name="main">Main slot here pls</slot>
  </div>
  <div>
    <h2 style="font-style: italic;">Footer:</h2>
    <slot name="footer">Footer slot here pls</slot>
  </div>
</template>

<style scoped></style>
