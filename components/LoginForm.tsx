'use client';

import {
  Form,
  Theme,
  TextInput,
  Button,
  Link,
  PasswordInput,
  Tile,
  Grid,
  useTheme,
} from '@carbon/react';
import { Login as LoginIcon } from '@carbon/icons-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

import { useTranslation } from 'react-i18next';


export default function Login() {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('auth.validation.emailInvalid')) // Ensure this matches the mock
      .required(t('auth.validation.emailRequired')),
    password: Yup.string()
      .min(8, t('auth.validation.passwordMin'))
      .required(t('auth.validation.passwordRequired')),
  });

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      console.log('Login attempt:', values);
      router.push('/dashboard');
    },
  });

  return (
    <Theme theme={theme}>
      <Grid className="auth-container">
        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        </div>
        <Tile className="auth-form">
          <div className="header">
            <h1>{t('auth.signIn')}</h1>
          </div>
          <Form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <TextInput
                id="email"
                labelText={t('auth.email')}
                type="email"
                {...formik.getFieldProps('email')}
                invalid={formik.touched.email && !!formik.errors.email}
                invalidText={formik.touched.email && formik.errors.email}
              />
            </div>
            <div className="form-group">
              <PasswordInput
                id="password"
                labelText={t('auth.password')}
                {...formik.getFieldProps('password')}
                invalid={formik.touched.password && !!formik.errors.password}
                invalidText={formik.touched.password && formik.errors.password}
              />
            </div>
            <div className="form-actions">
              <Button type="submit" renderIcon={LoginIcon}>
                {t('auth.login')}
              </Button>
              <Link href="/register">{t('auth.noAccount')}</Link>
            </div>
          </Form>
        </Tile>
      </Grid>
    </Theme>
  );
}