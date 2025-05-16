const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true
  },
  mois: {
    type: String,
    required: true
  },
  utilisateurs: {
    type: [Number],  // Tableau de nombres
    default: []
  },
  revenus: {
    type: [Number],
    default: []
  },
  engagement: {
    type: [Number],
    default: []
  }
});

module.exports = mongoose.model('Stats', statsSchema);
