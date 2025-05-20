import { useEffect, useState, useRef } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

import {
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const MenuProfil = ({ userInfo, onLogout }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Fermer menu au clic extérieur
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded text-white focus:outline-none transition"
      >
        <span>{userInfo?.username || 'Profil'}</span>
        {open ? (
          <ChevronUpIcon className="w-5 h-5" />
        ) : (
          <ChevronDownIcon className="w-5 h-5" />
        )}
      </button>

      {/* Menu déroulant */}
      <div
        className={`absolute right-0 mt-2 w-56 bg-white rounded shadow-lg z-20
          transform transition-all duration-200 origin-top-right
          ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        `}
      >
        <div className="p-4 border-b">
          <p className="font-semibold text-gray-900">{userInfo?.username}</p>
          <p className="text-sm text-gray-600">Rôle : {userInfo?.role}</p>
        </div>
        <ul className="py-2">
          <li>
            <a
              href="/profile"
              className="flex items-center px-4 py-2 hover:bg-indigo-100 text-gray-700"
              onClick={() => setOpen(false)}
            >
              <UserIcon className="w-5 h-5 mr-3" />
              Profil
            </a>
          </li>
          <li>
            <a
              href="/stats-table"
              className="flex items-center px-4 py-2 hover:bg-indigo-100 text-gray-700"
              onClick={() => setOpen(true)}
            >
              <Cog6ToothIcon className="w-5 h-5 mr-3" />
              Statistique
            </a>
          </li>
        </ul>
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-100 font-semibold rounded-b"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  //const[stats,setStats]= useState(null);
  const navigate = useNavigate();

  useEffect(() => {
   
    
    const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
             console.log ('token',token);
      const res = await API.get('/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res.data);
  
  
      const formatted = res.data.map(item => ({
        name: item.Mois,
        utilisateurs: item["utilisateurs"] || 0,
        revenus: item["revenus"] || 0,
        engagement: item["engagement"] || 0,
      })); 
      setData(formatted);
    } catch (err) {
      console.error(err);
    }
  };


    const fetchUser = async () => {
      try {
        const res = await API.get('/auth/me');
        setUserInfo(res.data);
        console.log(res);
      } catch {
        alert('Erreur d\'authentification');
        navigate('/login');
      }
    };
    fetchUser();
    fetchStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white flex justify-between items-center px-8 py-4 shadow-md">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <MenuProfil userInfo={userInfo} onLogout={handleLogout} />
      </nav>

      <main className="p-8 max-w-5xl mx-auto">
        {userInfo && (
          <section className="mb-8 p-6 bg-white rounded shadow">
            <p className="text-gray-700 mb-2">
              Connecté en tant que : <strong>{userInfo.userId}</strong>
            </p>
            <h2 className="text-xl font-semibold mb-1">Bienvenue {userInfo.username}</h2>
            <p>Rôle : {userInfo.role}</p>
          </section>
        )}

        <section className="p-6 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-6">Statistiques hebdo</h2>
            <div className="mt-8 text-right">
             <button
               onClick={() => navigate('/stats-table')}
               className="mt-3 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
               Format Tableau
             </button>
           </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
             <Line type="monotone" dataKey="engagement" stroke="#6366F1" strokeWidth={3} />
             <Line type="monotone" dataKey="revenus" stroke="#10B981" strokeWidth={3} />
             <Line type="monotone" dataKey="utilisateurs" stroke="#F59E0B" strokeWidth={3} />

              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
