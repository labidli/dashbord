const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

router.post('/register', register);
router.post('/login', login);

  
// info  de user
router.get('/me', auth, async (req, res) => {
  try {
      const user = await User.findById(req.userId).select('username role');
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
      return res.status(401).json({ error: 'Nom d’utilisateur ou mot de passe incorrect' });

    }

    res.json({
      message: 'Données sécurisées accessibles',
      userId: user._id, 
      username: user.username,
      role: user.role
    });
   
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;