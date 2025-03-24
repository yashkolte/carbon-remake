"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
    Button,
    Column,
    Row,
    TextInput,
    InlineLoading,
    Link,
    PasswordInput,
    Tile,
    Stack,
    FlexGrid,
} from '@carbon/react';
import { Login } from '@carbon/icons-react';
import styles from './LoginForm.module.scss';
import { useTheme } from '@/contexts/ThemeContext';

interface LoginValues {
    email: string;
    password: string;
}

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
});

const LoginPage: React.FC = () => {
    const router = useRouter();
    const { theme } = useTheme();

    const initialValues: LoginValues = {
        email: '',
        password: '',
    };

    const handleSubmit = async (
        values: LoginValues,
        { setSubmitting }: FormikHelpers<LoginValues>
    ) => {
        try {
            // TODO: Replace with your actual authentication logic
            console.log('Login attempt with:', values);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // On successful login, redirect to dashboard
            router.push('/dashboard')
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setSubmitting(false);
        }
    };

    // Log theme changes for debugging
    useEffect(() => {
        console.log('Current theme:', theme);
    }, [theme]);

    // Make sure we have a valid theme class
    const themeClass = theme === 'dark' ? styles.dark : styles.light;

    return (
        <div className={`${styles.loginPage} ${themeClass}`}>
            <FlexGrid >
                <Row className={styles.loginGrid}>
                    <Column lg={4} md={2} sm={0} />
                    <Column lg={8} md={4} sm={4}>
                        <Tile className={styles.loginTile}>
                            <Stack gap={7}>
                                <div className={styles.headerWrapper}>
                                    <Login className={styles.loginIcon} />
                                    <h1 className={styles.title}>Sign in</h1>
                                </div>

                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                                        <Form>
                                            <Stack gap={6}>
                                                <TextInput
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    labelText="Email"
                                                    placeholder="Enter your email"
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    invalid={touched.email && !!errors.email}
                                                    invalidText={touched.email ? errors.email : ''}
                                                />

                                                <PasswordInput
                                                    id="password"
                                                    name="password"
                                                    labelText="Password"
                                                    placeholder="Enter your password"
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    invalid={touched.password && !!errors.password}
                                                    invalidText={touched.password ? errors.password : ''}
                                                />

                                                <div className={styles.forgotPasswordWrapper}>
                                                    <Link href="/forgot-password">Forgot password?</Link>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className={styles.loginButton}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <InlineLoading description="Signing in..." />
                                                        </>
                                                    ) : (
                                                        'Sign in'
                                                    )}
                                                </Button>

                                                <div className={styles.signupWrapper}>
                                                    <p>
                                                        Don&apos;t have an account?{' '}
                                                        <Link href="/register">Create an account</Link>
                                                    </p>
                                                </div>
                                            </Stack>
                                        </Form>
                                    )}
                                </Formik>
                            </Stack>
                        </Tile>
                    </Column>
                    <Column lg={4} md={2} sm={0} />
                </Row>
            </FlexGrid>
        </div>
    );
};

export default LoginPage;
