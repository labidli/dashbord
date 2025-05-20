import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/login');
  };

  return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Inscription</h1>
                <RegisterForm onRegister={handleRegister} />
              </div>
            </div>
);
};

export default RegisterPage;
