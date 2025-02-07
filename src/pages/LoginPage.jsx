import React, { useState } from 'react';
import styles from './LoginPage.module.scss';
import { useSnackbar } from 'notistack';
import { useNavigate, useNavigation } from 'react-router-dom';
import { makeQuery } from '../utils/api';
import ReplaceOnLoading from '../utils/ReplaceOnLoading';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      await makeQuery(
        null,
        'login',
        { email, password },
        enqueueSnackbar,
        (data) => {
          localStorage.setItem('token', data.token)
          enqueueSnackbar('Ingresaste correctamente.', { variant: 'success' })
          if (data.role === "admin") return navigate('/manage-templates')
          if (data.role === "moderator") return navigate('/designs')
        },
        setIsLoading,
        (error) => {
          console.log(error)
        }
      )
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <h1 className={styles.title}>Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="tu@email.com"
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Tu contraseña"
            />
            {errors.password && <span className={styles.error}>{errors.password}</span>}
          </div>
          {errors.form && <div className={styles.formError}>{errors.form}</div>}
          <ReplaceOnLoading loading={isLoading}>
            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </ReplaceOnLoading>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

