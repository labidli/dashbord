import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import API from '../api';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const StatsTable = () => {
  const [stats, setStats] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    mois: '',
    utilisateurs: [],
    revenus: [],
    engagement: [],
  });

  useEffect(() => {
    fetchStats();
  }, []);

  
const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'json') {
    parseJSON(file);
  } else if (ext === 'csv') {
    parseCSV(file);
  } else if (ext === 'xlsx') {
    parseXLSX(file);
  } else {
    alert('Format non supporté');
  }
};
//normalisation pour les trois parseurs json , cvs ,xlsx
const normalizeKeys = (item) => ({
  mois: item.mois || item.Mois || '',
  utilisateurs: Array.isArray(item.utilisateurs) ? item.utilisateurs : [parseInt(item.utilisateurs || item.Utilisateurs || 0)],
  revenus: Array.isArray(item.revenus) ? item.revenus : [parseFloat(item.revenus || item.Revenus || 0)],
  engagement: Array.isArray(item.engagement) ? item.engagement : [parseFloat(item.engagement || item.Engagement || 0)]
});

const parseJSON = (file) => {
  const reader = new FileReader();
  reader.onload = async (evt) => {
    try {
      const arr = JSON.parse(evt.target.result);
      const normalized = arr.map(normalizeKeys);
      await bulkUpload(normalized);
    } catch {
      alert('JSON invalide');
    }
  };
  reader.readAsText(file);
};

const parseCSV = (file) => {
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete: async (results) => {
      const parsed = results.data.map(normalizeKeys);
      await bulkUpload(parsed);
    },
    error: () => alert('Erreur de parsing CSV')
  });
};

const parseXLSX = (file) => {
  const reader = new FileReader();
  reader.onload = async (evt) => {
    const workbook = XLSX.read(evt.target.result, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { raw: true });
    const normalized = data.map(normalizeKeys);
    await bulkUpload(normalized);
  };
  reader.readAsBinaryString(file);
};

// Envoi en “bulk” vers  serveur
const bulkUpload = async (arrayOfStats) => {
  try {
    const token = localStorage.getItem('token');
    
    const res = await API.post(
      '/stats/bulk',
      { stats: arrayOfStats },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    setStats(res.data);     
  } catch (err) {
    console.error('Erreur bulk upload :', err.response?.data || err.message);
    alert('Impossible d’importer les données');
  }
};

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des stats :', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'utilisateurs' || name === 'revenus' || name === 'engagement') {
      setFormData((prev) => ({ ...prev, [name]: [Number(value)] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAdd = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.post('/stats', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats([...stats, res.data]);
      setFormData({ mois: '', utilisateurs: [], revenus: [], engagement: [] });
      console.log(res.data);
    } catch (err) {
      console.error('Erreur lors de l\'ajout :', err.response?.data || err.message);
    }
  };

  const handleEdit = (stat) => {
    setEditingId(stat._id);
    setFormData({
      mois: stat.mois,
      utilisateurs: stat.utilisateurs,
      revenus: stat.revenus,
      engagement: stat.engagement,
    });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.put(`/stats/${editingId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = stats.map((s) => (s._id === editingId ? res.data : s));
      setStats(updated);
      setEditingId(null);
      setFormData({ mois: '', utilisateurs: [], revenus: [], engagement: [] });
    } catch (err) {
      console.error('Erreur lors de la mise à jour :', err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/stats/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(stats.filter((s) => s._id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression :', err.response?.data || err.message);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Tableau des Statistiques</h2>
        
      {/* Formulaire */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <input
          name="mois"
          value={formData.mois}
          onChange={handleInputChange}
          placeholder="Mois"
          className="border p-2 rounded"
        />
        <input
          name="utilisateurs"
          type="number"
          value={formData.utilisateurs[0] || ''}
          onChange={handleInputChange}
          placeholder="Utilisateurs"
          className="border p-2 rounded"
        />
        <input
          name="revenus"
          type="number"
          value={formData.revenus[0] || ''}
          onChange={handleInputChange}
          placeholder="Revenus (€)"
          className="border p-2 rounded"
        />
        <input
          name="engagement"
          type="number"
          value={formData.engagement[0] || ''}
          onChange={handleInputChange}
          placeholder="Engagement (%)"
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={editingId ? handleUpdate : handleAdd}
        className="mb-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        {editingId ? 'Mettre à jour' : 'Ajouter'} <PlusIcon className="w-5 h-5 inline ml-1" />
      </button>

       {/* ========== Import depuis fichier ========== */}
    <div className="mb-6 flex items-center space-x-4">
      <label
        htmlFor="file-input"
        className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Importer Fichier .csv , .json , .Xslx
        <PlusIcon className="w-5 h-5 inline ml-1" />
      </label>
      <input
        id="file-input"
        type="file"
        accept=".json, .csv, .xlsx"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border">Mois</th>
              <th className="px-4 py-2 border">Utilisateurs</th>
              <th className="px-4 py-2 border">Revenus (€)</th>
              <th className="px-4 py-2 border">Engagement (%)</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat) => (
              <tr key={stat._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{stat.mois}</td>
                <td className="px-4 py-2 border">{stat.utilisateurs?.[0]}</td>
                <td className="px-4 py-2 border">{stat.revenus?.[0]}</td>
                <td className="px-4 py-2 border">{stat.engagement?.[0]}</td>
                <td className="px-4 py-2 border flex space-x-2">
                  <button
                    onClick={() => handleEdit(stat)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(stat._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsTable;
