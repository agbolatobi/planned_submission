import { useState, useEffect } from 'react'
import { Button, CircularProgress, Stack, TextField, Typography } from '@mui/material'
import { useCreateUser } from '../query/useCreateUser'
import { useGetUser } from '../query/useGetUser'
import { useUser } from '../context/UserContext'
import * as yup from 'yup'
import { Formik, Form, FormikHelpers } from 'formik'

// Validation schema
const loginSchema = yup.object().shape({
    email: yup
        .string()
        .required('Email is required')
        .email('Please enter a valid email address')
        .trim(),
})

interface LoginFormValues {
    email: string
}

export default function UserLogin() {
    const { setUser } = useUser()
    const { mutateAsync: createUser, isPending: isCreating } = useCreateUser()
    const [email, setEmail] = useState("")
    const { data: userData, refetch: getUser, isLoading } = useGetUser({ email: email })


    useEffect(() => {
        if (userData && userData) {
            setUser(userData)
        }
    }, [userData])

    const handleSubmit = async (
        values: LoginFormValues,
        { setSubmitting, setFieldError }: FormikHelpers<LoginFormValues>
    ) => {
        try {
            // First, try to get the user with the current email
            setEmail(values.email)
        } catch (err) {
            setFieldError('email', 'Failed to log in. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Stack spacing={3} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                User Login
            </Typography>
            <Formik
                initialValues={{ email: '' }}
                validationSchema={loginSchema}
                onSubmit={handleSubmit}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                }) => (
                    <Form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                id="email"
                                name="email"
                                label="Email"
                                variant="outlined"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                                disabled={isLoading || isSubmitting}
                            />
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isLoading || isSubmitting}
                                sx={{ height: 48 }}
                            >
                                {(isLoading || isSubmitting) ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Login'
                                )}
                            </Button>
                            <Button
                                fullWidth
                                type="button"
                                variant="contained"
                                color="error"
                                disabled={isLoading || isCreating}
                                sx={{ height: 48 }}
                                onClick={() => {
                                    loginSchema.validate({ email: values.email })
                                      .then(() => {
                                        return createUser({ email: values.email });
                                      })
                                      .then(() => {
                                        setEmail(values.email);
                                      })
                                      .catch((err) => {
                                        // Yup validation error will be caught here
                                        console.error(err);
                                      });
                                }}
                            >
                                {(isLoading || isCreating) ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </Stack>
    )
}