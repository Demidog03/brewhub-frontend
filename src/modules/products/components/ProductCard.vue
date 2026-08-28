<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'

interface ProductCardProps {
  /** URL картинки товара */
  image: string
  /** Alt-текст картинки (для доступности) */
  imageAlt?: string
  /** Название товара */
  title: string
  /** Текущая цена */
  price: number
  /** Старая цена (если есть скидка) */
  oldPrice?: number
  /** Процент скидки для бейджа, напр. 13 -> "-13%" */
  discount?: number
  /** Валюта для форматирования цены */
  currency?: string
}

const props = withDefaults(defineProps<ProductCardProps>(), {
  imageAlt: '',
  oldPrice: undefined,
  discount: undefined,
  currency: '$',
})

const emit = defineEmits<{
  add: []
}>()

const formatPrice = (value: number) => `${props.currency}${value.toFixed(2)}`

const formattedPrice = computed(() => formatPrice(props.price))
const formattedOldPrice = computed(() =>
  props.oldPrice !== undefined ? formatPrice(props.oldPrice) : null,
)

const handleAdd = () => {
  emit('add')
}
</script>

<template>
  <article class="product-card">
    <div class="product-card__media">
      <img
        :src="image"
        :alt="imageAlt || title"
        class="product-card__image"
        loading="lazy"
      />

      <span v-if="discount" class="product-card__badge">
        -{{ discount }}%
      </span>
    </div>

    <h3 class="product-card__title">{{ title }}</h3>

    <div class="product-card__footer">
      <div class="product-card__price">
        <span v-if="formattedOldPrice" class="product-card__price-old">
          {{ formattedOldPrice }}
        </span>
        <span class="product-card__price-current">{{ formattedPrice }}</span>
      </div>

      <Button
        rounded
        outlined
        icon="pi pi-plus"
        aria-label="Add to cart"
        class="product-card__add-btn"
        @click="handleAdd"
      />
    </div>
  </article>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.product-card__media {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: var(--p-content-border-radius);
  overflow: hidden;
  background-color: var(--p-surface-100);
}

.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.product-card__badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--p-content-border-radius);
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--p-surface-0);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
}

.product-card__title {
  margin: 0.75rem 0 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--p-text-color);
}

.product-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.product-card__price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.product-card__price-old {
  text-decoration: line-through;
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
}

.product-card__price-current {
  color: var(--p-text-color);
  font-weight: 700;
  font-size: 1rem;
}

.product-card__add-btn {
  flex-shrink: 0;
}
</style>