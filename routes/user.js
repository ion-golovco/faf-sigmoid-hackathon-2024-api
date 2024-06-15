var express = require('express');
const supabase = require('../supabase');
var router = express.Router();

// Handle GET request to root URL
// router.get('/', async function (req, res, next) {
//   try {
//     const session = await supabase.auth.getUser(req.headers.authorization);
//     const user = await supabase.from('users').select().eq('email', session.data.user?.email).single();
//     res.json({ ...user });
//   } catch (error) {
//     res.status(401).json({ error: error.message });
//   }
// });

// Handle POST request to root URL
router.post('/', async function (req, res, next) {
  try {
    await supabase.auth.getUser(req.headers.authorization);
    const user = await supabase.from('users').insert({
      interest: req.body.interest,
      username: req.body.username,
      email: req.body.email,
    }).select().single();
    res.json({ ...user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
