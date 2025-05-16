const Stats = require('../models/Stats');

// Récupérer toutes les stats
exports.getAllStats = async (req, res) => {
  try {
    const stats = await Stats.find();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour une stat par ID
exports.updateStats = async (req, res) => {
  try {
    const stat = await Stats.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(stat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer une stat
exports.deleteStats = async (req, res) => {
  try {
    await Stats.findByIdAndDelete(req.params.id);
    res.json({ message: "Stat supprimée" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
