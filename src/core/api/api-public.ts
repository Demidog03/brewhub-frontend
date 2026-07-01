import axios from 'axios'
import { createErrorResponseInterceptor } from './interceptors'

// apiPublic -> instance axios-а -> копия axios (но с параметрами)
export const apiPublic = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
})

// interceptor - Глобальный обработчик ответов запросов - Global Error Handler - Глобальный обработчик ошибок
apiPublic.interceptors.response.use(
  response => response,
  createErrorResponseInterceptor({ redirectOnUnauthorized: false })
)
