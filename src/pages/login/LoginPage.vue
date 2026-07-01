<script setup lang="ts">
import authApi from '@/modules/auth/api/auth.api';
import AuthFormLayout from '@/modules/auth/layouts/AuthFormLayout.vue';
import { loginSchema } from '@/modules/auth/validation/auth.validation';
import { useNotificationStore } from '@/stores/notification.store';
import { toTypedSchema } from '@vee-validate/yup';
import { Button, InputText, Message, Password } from 'primevue';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter()
const { defineField, handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(loginSchema)
})

const notificationStore = useNotificationStore()
const [email, emailProps] = defineField('email')
const [password, passwordProps] = defineField('password')

const loading = ref<boolean>(false)

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    const response = await authApi.login({
      email: values.email,
      password: values.password
    })

    if (response) {
      notificationStore.success('Welcome back!')
      router.push('/')
    }
  }
  finally {
    loading.value = false
  }
})

</script>

<template>
  <AuthFormLayout>
    <template #title>Login</template>
    <template #subtitle>Do not have an account, create a new one.</template>
    <template #form>
      <form class="login-form" novalidate @submit.prevent="onSubmit">
        <div class="login-form-container">
          <div>
            <label class="form-label" for="login-email">Email</label>
            <InputText id="login-email" v-model="email" v-bind="emailProps" autocomplete="email"
              placeholder="sagynysh@gmail.com" fluid :invalid="Boolean(errors.email)" />
            <Message v-if="Boolean(errors.email)" severity="error" size="small" variant="simple">{{ errors.email }}
            </Message>
          </div>

          <div>
            <label class="form-label" for="login-password">Password</label>
            <Password id="login-password" v-model="password" v-bind="passwordProps" :feedback="false"
              autocomplete="new-password" toggle-mask placeholder="At least 8 characters" fluid
              :invalid="Boolean(errors.password)" />
            <Message v-if="Boolean(errors.password)" severity="error" size="small" variant="simple">{{ errors.password
              }}
            </Message>
          </div>
        </div>

        <Button :loading="loading" class="submit-button" size="large" type="submit" label="Login" severity="contrast" rounded fluid />
        <RouterLink to="/register">
          <Button variant="text" severity="contrast">
            Do not have an account? Please, sign up.
          </Button>
        </RouterLink>
      </form>
    </template>
  </AuthFormLayout>
</template>

<style scoped>
.login-form-container {
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 20px;
}

.form-label {
  display: inline-block;
  margin-bottom: 10px;
}

.submit-button {
  margin-top: 40px;
  margin-bottom: 10px;
}
</style>
