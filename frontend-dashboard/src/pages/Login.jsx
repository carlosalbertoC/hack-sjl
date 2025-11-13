import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // No validar, solo redirigir
    navigate('/dashboard/monitor');
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>
          Dashboard de Mando Táctico
          <span>Municipalidad de San Juan de Lurigancho</span>
        </h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ingrese su usuario"
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.button}>
            Ingresar
          </button>
        </form>
        <p className={styles.meta}>
          Acceso reservado • <strong>Comité de Respuesta</strong>
        </p>
      </div>
    </div>
  );
};

export default Login;
