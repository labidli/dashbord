import { useState } from 'react';
import API from '../api';

const RegisterForm = () => {
  const [username, setUsername ] = useState('');
  const [role, setRole ] = useState('User');
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
    <form onSubmit={handleRegister}  className="space-y-6">
        
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Nom d'utilisateur</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nom d'utilisateur"
          required
        />
      </div>
      <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
      </div>
      

      <button type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
         disabled={loading}>
        {loading ? 'Enregistrement...' : 'S’enregistrer'}
      </button>

      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
    </form>
  );
};

export default RegisterForm;
