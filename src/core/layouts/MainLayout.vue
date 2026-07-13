<script setup lang="ts">
import { Avatar, Badge, Button, Menubar } from 'primevue';
import { ref } from 'vue';
import { RouterView } from 'vue-router';

const items = ref([
  {
    label: 'Home',
  },
  {
    label: 'Categories',
    badge: 3,
    items: [
      {
        label: 'Core',
        icon: 'pi pi-bolt',
        shortcut: '⌘+S'
      },
      {
        label: 'Blocks',
        icon: 'pi pi-server',
        shortcut: '⌘+B'
      },
      {
        separator: true
      },
      {
        label: 'UI Kit',
        icon: 'pi pi-pencil',
        shortcut: '⌘+U'
      }
    ]
  },
  {
    label: 'Contact Us',
  },
  {
    label: 'Blog',
  },
]);
</script>

<template>
  <div class="main-container">
    <header class="header">
      <Menubar :model="items">
        <template #start>
          <a v-ripple class="flex items-center logo-text">
            <span>Brewhub <i class="pi pi-heart-fill"></i></span>
          </a>
        </template>
        <template #item="{ item, props, hasSubmenu, root }">
          <a v-ripple class="flex items-center" v-bind="props.action">
            <span>{{ item.label }}</span>
            <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
            <span v-if="item.shortcut"
              class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut
              }}</span>
            <i v-if="hasSubmenu"
              :class="['pi pi-angle-down ml-auto', { 'pi-angle-down': root, 'pi-angle-right': !root }]"></i>
          </a>
        </template>
        <template #end>
          <div class="flex items-center gap-2">
            <!-- <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" /> -->
             <RouterLink to="/login">
              <Button severity="primary" size="small" label="Login"/>
             </RouterLink>
          </div>
        </template>
      </Menubar>
    </header>
    <main class="main">
      <RouterView />
      <!-- Плейсхолдер для наших страниц -->
      <!-- /products -> MainLayout -> <main><ProductsPage/></main> -->
    </main>
  </div>
</template>

<style scoped>
.header,
.main {
  max-width: 1230px;
  padding-inline: 15px;
  margin-inline: auto;
  margin-top: 20px;
}

.logo-text {
  font-weight: 700;
  font-size: 1.5rem;
  cursor: pointer;
}

:global(.p-menubar) {
  justify-content: space-between;
  align-items: center;
  background: var(--p-menubar-border-color) !important;
}

:global(.p-menubar-end) {
  margin-left: 0 !important;
}
</style>
