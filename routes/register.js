var express = require('express');
var router = express.Router();
const supabase = require('../supabase');

// POST /register
// router.post('/', async (req, res, next) => {
//     const { email, password } = req.body;

//     try {
//         // Attempt to register the user
//         const { data, error } = await supabase.auth.signUp({
//             email,
//             password,
//         });

//         if (error) {
//             res.status(401).json({ error })
//         }

//         // User successfully registered and profile updated
//         res.json({ token: data.session.access_token });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

module.exports = router;
