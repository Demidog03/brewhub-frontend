import MainLayout from '@/core/layouts/MainLayout.vue'
import LoginPage from '@/pages/login/LoginPage.vue'
import ProductsPage from '@/pages/products/ProductsPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      component: MainLayout,
      children: [
        {
          path: 'products',
          component: ProductsPage,
        },
        {
          path: 'login',
          component: LoginPage,
        },
      ],
    },
  ],
})

export default router
