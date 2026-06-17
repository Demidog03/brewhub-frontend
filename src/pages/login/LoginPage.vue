<script setup lang="ts">
import AuthFormLayout from '@/modules/auth/layouts/AuthFormLayout.vue';
import { loginSchema } from '@/modules/auth/validation/auth.validation';
import { toTypedSchema } from '@vee-validate/yup';
import { Button, InputText, Message, Password } from 'primevue';
import { useForm } from 'vee-validate';
import { watch } from 'vue';

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(loginSchema)
})

const [email, emailProps] = defineField('email')
const [password, passwordProps] = defineField('password')

function onSubmit() {
  // handleSubmit()
}

watch(errors, () => {
  console.log(errors.value)
})

</script>

<template>
  <AuthFormLayout>
    <template #title>Login</template>
    <template #subtitle>Do not have an account, create a new one.</template>
    <template #form>
      <form class="login-form" novalidate @submit="onSubmit">
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

        <Button class="submit-button" size="large" type="submit" label="Login" severity="contrast" rounded fluid />
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
}
</style>
