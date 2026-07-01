import router from "@/router"
import { useNotificationStore } from "@/stores/notification.store"
import type { AxiosError, InternalAxiosRequestConfig } from "axios"

export interface ApiErrorBody {
    error?: string
    issues?: unknown
}

interface ErrorInterceptorOptions {
    redirectOnUnauthorized?: boolean
}

export function extractErrorMessage(error: AxiosError<ApiErrorBody>): string {
    if (error.response) { // ошибки после запроса
        return (
            error.response.data?.error || `Request failed with status ${error.response.status}` 
        )
    }
    if (error.request) { // ошибки перед запросом
        return 'Network error'
    }
    return error.message || 'Unexpected error occured.'
}

export function createErrorResponseInterceptor(options: ErrorInterceptorOptions = {}) {
    const { redirectOnUnauthorized = true } = options

    return (error: AxiosError<ApiErrorBody>) => {
        const message = extractErrorMessage(error)
        const status = error.response?.status

        if (status === 401 && redirectOnUnauthorized) { // если пользователь зашел на страницу защищенную и если он не авторизован то отправяем на сттаницу логин
            const current = router.currentRoute.value
            if (current.name !== 'login') {
                router.push({ name: 'login' })
            }
        }

        useNotificationStore().error(message)

        return Promise.reject(error)
    }
}