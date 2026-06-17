import axios from 'axios'

// apiPublic -> instance axios-а -> копия axios (но с параметрами)
export const apiPublic = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
})
