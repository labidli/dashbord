// LoginForm.jsx
import { useState } from 'react';
import API from '../api';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      onLogin();
    } catch (err){
      console.error(err);
      alert('Identifiants invalides');
    }
  };

  return (
    <form onSubmit={handleSubmit}  className="space-y-6">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Nom d'utilisateur</label>
      <input 
         value={username} 
         onChange={(e) => setUsername(e.target.value)} 
         placeholder="Nom d'utilisateur" className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Mot de passe</label>

       <input 
         type="password" 
         value={password} 
         onChange={(e) => setPassword(e.target.value)}
         placeholder="Mot de passe" className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
     </div> 
       <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
        Se connecter
      </button>
    </form>
  );
};

export default LoginForm;
