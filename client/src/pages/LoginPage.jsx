import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
//import RegisterForm from '../components/RegisterForm';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Connexion</h1>
        <LoginForm onLogin={handleLoginSuccess} />

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">crée un compte ?</p>
          <button
            onClick={() => navigate('/register')}
            className="mt-3 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            S’enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
