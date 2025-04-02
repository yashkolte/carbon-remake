"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
    Button,
    Column,
    Row,
    InlineLoading,
    Link,
    PasswordInput,
    Tile,
    Stack,
    FlexGrid,
} from '@carbon/react';
import TextInput from '@/components/shared/TextInput';
import { Login } from '@carbon/icons-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface LoginValues {
    email: string;
    password: string;
}

const LoginPage = () => {
    const router = useRouter();
    const { theme } = useTheme();
    const { t } = useTranslation('common');

    const initialValues: LoginValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email(t('login.validation.invalidEmail'))
            .required(t('login.validation.emailRequired')),
        password: Yup.string()
            .min(8, t('login.validation.passwordMinLength'))
            .required(t('login.validation.passwordRequired')),
    });

    const handleSubmit = async (
        values: LoginValues,
        { setSubmitting }: FormikHelpers<LoginValues>
    ) => {
        try {
            console.log('Login attempt with:', values);
            await new Promise(resolve => setTimeout(resolve, 1500));
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
    const themeClass = theme === 'dark' ? 'dark-theme' : 'light-theme';

    return (
        <div className={`loginPage ${themeClass}`}>
            <FlexGrid>
                <Row className="loginGrid">
                    <Column lg={4} md={2} sm={0} />
                    <Column lg={8} md={4} sm={4}>
                        <Tile className="loginTile">
                            <Stack gap={7}>
                                <div className="headerWrapper">
                                    <Login className="loginIcon" />
                                    <h1 className="title">{t('login.signIn')}</h1>
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
                                                    labelText={t('login.email')}
                                                    placeholder={t('login.emailPlaceholder')}
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    invalid={touched.email && !!errors.email}
                                                    invalidText={touched.email ? errors.email : ''}
                                                />
                                                <PasswordInput
                                                    id="password"
                                                    name="password"
                                                    labelText={t('login.password')}
                                                    placeholder={t('login.passwordPlaceholder')}
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    invalid={touched.password && !!errors.password}
                                                    invalidText={touched.password ? errors.password : ''}
                                                />
                                                <div className="forgotPasswordWrapper">
                                                    <Link href="/forgot-password">{t('login.forgotPassword')}</Link>
                                                </div>
                                                <Button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="loginButton"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <InlineLoading description={t('login.signingIn')} />
                                                        </>
                                                    ) : (
                                                        t('login.signIn')
                                                    )}
                                                </Button>
                                                <div className="signupWrapper">
                                                    <p>
                                                        {t('login.dontHaveAccount')}{' '}
                                                        <Link href="/register">{t('login.createAccount')}</Link>
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
