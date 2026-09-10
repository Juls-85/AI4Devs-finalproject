import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import RegisterPage from './RegisterPage';
import '@testing-library/jest-dom';

const renderRegisterPage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <RegisterPage />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('RegisterPage', () => {
  it('should render register form', () => {
    renderRegisterPage();

    expect(screen.getByText(/Registrarse/i)).toBeInTheDocument();
    expect(screen.getByText(/Crea tu cuenta de Frapen Angels/i)).toBeInTheDocument();
  });

  it('should display all required form fields', () => {
    renderRegisterPage();

    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
  });

  it('should display optional form fields', () => {
    renderRegisterPage();

    expect(screen.getByLabelText(/DNI/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha de nacimiento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dirección/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ciudad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Código postal/i)).toBeInTheDocument();
  });

  it('should have register button', () => {
    renderRegisterPage();

    const registerButton = screen.getByRole('button', { name: /registrarse/i });
    expect(registerButton).toBeInTheDocument();
  });

  it('should update form fields when user types', async () => {
    renderRegisterPage();

    const firstNameInput = screen.getByLabelText(/Nombre/i) as HTMLInputElement;
    const lastNameInput = screen.getByLabelText(/Apellido/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/Correo electrónico/i) as HTMLInputElement;

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    await waitFor(() => {
      expect(firstNameInput.value).toBe('John');
      expect(lastNameInput.value).toBe('Doe');
      expect(emailInput.value).toBe('john@example.com');
    });
  });

  it('should display login link', () => {
    renderRegisterPage();

    const loginLink = screen.getByText(/¿Ya tienes cuenta/i);
    expect(loginLink).toBeInTheDocument();
  });

  it('form fields should be in 2 columns layout', () => {
    const { container } = renderRegisterPage();

    const formRows = container.querySelectorAll('.form-row');
    expect(formRows.length).toBeGreaterThan(0);
  });
});
