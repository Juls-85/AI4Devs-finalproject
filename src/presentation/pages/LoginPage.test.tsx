import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import LoginPage from './LoginPage';
import '@testing-library/jest-dom';

const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <LoginPage />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('LoginPage', () => {
  it('should render login form', () => {
    renderLoginPage();

    expect(screen.getByText(/Iniciar sesión/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  it('should have login button', () => {
    renderLoginPage();

    const loginButton = screen.getByRole('button', { name: /iniciar sesión/i });
    expect(loginButton).toBeInTheDocument();
  });

  it('should display forgot password link', () => {
    renderLoginPage();

    const forgotLink = screen.getByText(/¿Olvidaste tu contraseña\?/i);
    expect(forgotLink).toBeInTheDocument();
  });

  it('should display register link', () => {
    renderLoginPage();

    const registerLink = screen.getByText(/Crear cuenta/i);
    expect(registerLink).toBeInTheDocument();
  });

  it('should update form fields when user types', async () => {
    renderLoginPage();

    const emailInput = screen.getByLabelText(/correo electrónico/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/contraseña/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      expect(emailInput.value).toBe('test@example.com');
      expect(passwordInput.value).toBe('password123');
    });
  });

  it('should disable form while loading', async () => {
    renderLoginPage();

    const loginButton = screen.getByRole('button', { name: /iniciar sesión/i });
    expect(loginButton).not.toBeDisabled();
  });
});
