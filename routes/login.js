var express = require('express');
var router = express.Router();
const supabase = require('../supabase');

// POST /login
router.post('/', async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Attempt to sign in the user
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            res.status(401).json({ error })
        }

        // User successfully logged in
        res.json({ token: data.session.access_token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

module.exports = router;
