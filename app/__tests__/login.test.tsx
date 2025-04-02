import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useRouter } from 'next/navigation';
import Login from '@/components/LoginForm';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock i18n translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'auth.validation.emailInvalid': 'Invalid email address',
        'auth.validation.emailRequired': 'Email is required',
        'auth.validation.passwordRequired': 'Password is required',
        'auth.validation.passwordMin': 'Password must be at least 8 characters',
        'auth.signIn': 'Sign In',
        'auth.email': 'Email',
        'auth.password': 'Password',
        'auth.login': 'Login',
        'auth.noAccount': 'Don’t have an account? Register',
      };
      return translations[key] || key;
    },
  }),
}));

describe('Login Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form', () => {
    render(<Login />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Don’t have an account? Register')).toBeInTheDocument();
  });

  it('validates empty form submission', async () => {
    render(<Login />);
    fireEvent.click(screen.getByText('Login'));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  it('validates password length', async () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'short' } });
    fireEvent.click(screen.getByText('Login'));

    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Login')); // Simulate form submission
  
    // Wait for the mockPush to be called
    await screen.findByText('Sign In'); // Wait for the component to re-render
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
});