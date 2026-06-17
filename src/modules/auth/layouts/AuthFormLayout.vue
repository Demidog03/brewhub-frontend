<script setup lang="ts">
import formImage from '@/assets/images/auth-form-image.jpg'
</script>

<template>
  <div class="auth-card">
    <section class="auth-form-panel">
      <div class="auth-form-inner">
        <h1 class="auth-title">
          <slot name="title" />
        </h1>
        <p class="auth-subtitle">
          <slot name="subtitle" />
        </p>
        <slot name="form" />
      </div>
    </section>
    <aside class="auth-visual-panel">
      <img class="auth-visual-panel-image" :src="formImage" alt="Brewhub Form Image">
    </aside>
  </div>
</template>

<style scoped>
.auth-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 620px;
  border: 1px solid var(--p-content-border-color);
  border-radius: 16px;
  overflow: hidden;
  background: var(--p-content-background);
  color: var(--p-text-color);
}

.auth-form-panel {
  display: flex;
  align-items: center;
  padding: 3rem 2.5rem;
}

.auth-form-inner {
  width: 100%;
  max-width: 420px;
  margin-inline: auto;
}

.auth-title {
  margin: 0 0 0.5rem;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.auth-subtitle {
  margin: 0 0 2rem;
  color: var(--p-text-muted-color);
  font-size: 0.95rem;
}

.auth-visual-panel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 860px) {
  .auth-card {
    grid-template-columns: 1fr;
    min-height: 0;
  }

  .auth-visual-panel {
    display: none;
  }

  .auth-form-panel {
    padding: 2.5rem 1.5rem;
  }
}
</style>
