<script setup lang="ts">
import AuthFormLayout from '@/modules/auth/layouts/AuthFormLayout.vue';
import { registerSchema } from '@/modules/auth/validation/auth.validation';
import { toTypedSchema } from '@vee-validate/yup';
import { Button, InputText, Message, Password } from 'primevue';
import { useForm } from 'vee-validate';
import { watch } from 'vue';

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(registerSchema)
})

const [name, nameProps] = defineField('name')
const [email, emailProps] = defineField('email')
const [password, passwordProps] = defineField('password')
const [confirmPassword, confirmPasswordProps] = defineField('confirmPassword')

function onSubmit() {
  // handleSubmit()
}

watch(errors, () => {
  console.log(errors.value)
})

</script>

<template>
  <AuthFormLayout>
    <template #title>Register</template>
    <template #subtitle>Already Have An Account, Login.</template>
    <template #form>
      <form class="register-form" novalidate @submit="onSubmit">
        <div class="register-form-container">
          <div>
            <label class="form-label" for="register-name">Full Name</label>
            <InputText id="register-name" v-model="name" v-bind="nameProps" autocomplete="name"
              placeholder="Sagynysh Kurmanbek" fluid :invalid="Boolean(errors.name)" />
            <Message v-if="Boolean(errors.name)" severity="error" size="small" variant="simple">{{ errors.name }}
            </Message>
          </div>

          <div>
            <label class="form-label" for="register-email">Email</label>
            <InputText id="register-email" v-model="email" v-bind="emailProps" autocomplete="email"
              placeholder="sagynysh@gmail.com" fluid :invalid="Boolean(errors.email)" />
            <Message v-if="Boolean(errors.email)" severity="error" size="small" variant="simple">{{ errors.email }}
            </Message>
          </div>

          <div>
            <label class="form-label" for="register-password">Password</label>
            <Password id="register-password" v-model="password" v-bind="passwordProps" :feedback="false"
              autocomplete="new-password" toggle-mask placeholder="At least 8 characters" fluid
              :invalid="Boolean(errors.password)" />
            <Message v-if="Boolean(errors.password)" severity="error" size="small" variant="simple">{{ errors.password
            }}
            </Message>
          </div>

          <div>
            <label class="form-label" for="register-confirmPassword">Confirm Password</label>
            <Password id="register-confirmPassword" v-model="confirmPassword" v-bind="confirmPasswordProps"
              :feedback="false" autocomplete="new-password" toggle-mask placeholder="Repeat your password" fluid
              :invalid="Boolean(errors.confirmPassword)" />
            <Message v-if="Boolean(errors.confirmPassword)" severity="error" size="small" variant="simple">{{
              errors.confirmPassword }}
            </Message>
          </div>
        </div>
        <Button class="submit-button" size="large" type="submit" label="Create Account" severity="contrast" rounded
          fluid />
      </form>
    </template>
  </AuthFormLayout>
</template>

<style scoped>
.register-form-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
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
