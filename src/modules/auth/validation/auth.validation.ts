import * as yup from 'yup'

// trim = '  Olzhas  ' -> 'Olzhas'
export const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Name is required!')
    .max(255, 'Name must be at most 255 characters'),
  email: yup.string().trim().required('Email is required!').email('Enter a valid email address'),
  password: yup
    .string()
    .required('Password is required!')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*_(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
})

export type RegisterValues = yup.InferType<typeof registerSchema> // yup.InferType => registerSchema -> interface

export const loginSchema = yup.object({
  email: yup.string().trim().required('Email is required!').email('Enter a valid email address'),
  password: yup
    .string()
    .required('Password is required!')
    .min(8, 'Password must be at least 8 characters'),
})

export type LoginValues = yup.InferType<typeof loginSchema>
