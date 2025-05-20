const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  userid: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'User', 
     required: true
  },
  mois: {
    type: String,
    required: true
  },
  utilisateurs: {
    type: [Number], 
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
