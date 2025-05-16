import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/login');
  };

  return (
    <div>
      <RegisterForm onRegister={handleRegister} />
    </div>
  );
};

export default RegisterPage;
