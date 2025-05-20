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

// Créer une nouvelle statistique
exports.createStats = async (req, res) => {
   console.log(req.body);
  try {
    const newStat = new Stats({
      mois: req.body.mois,
      utilisateurs: req.body.utilisateurs,
      revenus: req.body.revenus,
      engagement: req.body.engagement,
      userid: req.user.id //id depuis le token
    });
    const saved = await newStat.save();
    console.log(saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
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

//
exports.createStatsBulk = async (req, res) => {
  try {
    const userId = req.user.id;  
    // on s’attend à ce que req.body.stats soit un array d’objets avec mois/utilisateurs/…
    const docs = req.body.stats.map(item => ({
      mois:         item.mois,
      utilisateurs: Array.isArray(item.utilisateurs) ? item.utilisateurs : [item.utilisateurs],
      revenus:      Array.isArray(item.revenus)    ? item.revenus    : [item.revenus],
      engagement:   Array.isArray(item.engagement) ? item.engagement : [item.engagement],
      userid:       userId
    }));

    const inserted = await Stats.insertMany(docs);
    res.status(201).json(inserted);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
