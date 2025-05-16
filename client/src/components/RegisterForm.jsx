import { useState } from 'react';
import API from '../api';

const RegisterForm = () => {
  const [username, setUsername ] = useState('');
  const [role, setRole ] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
   const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await API.post('/auth/register', { username, password ,role });
      setSuccess(true);
      setSuccessMsg('✅ Utilisateur enregistré avec succès ! Vous pouvez vous connecter.');
      setUsername('');
      setPassword('');
      setRole('');
    } catch (err) {
      console.error('Erreur d’enregistrement :', err);
      setErrorMsg(
        err.response?.data?.error || 'Erreur lors de l’enregistrement'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Inscription</h2>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nom d'utilisateur"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        required
      />

      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Role"
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Enregistrement...' : 'S’enregistrer'}
      </button>

      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
    </form>
  );
};

export default RegisterForm;
