var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require("openai");

var router = express.Router();

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

router.post('/login', async (req, res, next) => {
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

router.post('/register', async (req, res, next) => {
  const { email, password } = req.body;

  try {
      // Attempt to register the user
      const { data, error } = await supabase.auth.signUp({
          email,
          password,
      });

      if (error) {
          res.status(401).json({ error })
      }

      // User successfully registered and profile updated
      res.json({ token: data.session.access_token });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});


const configuration = new Configuration({
    apiKey: '',
});
const openai = new OpenAIApi(configuration);

const conversationContextPrompt = "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: ";

router.post('/', async function (req, res, next) {  // Extracting the user's message from the request body 
    const message = req.body.message;
    console.log(message)
    try {
        openai.createCompletion({
            model: "gpt-3.5-turbo",
            // Adding the conversation context to the message being sent 
            prompt: conversationContextPrompt + message,
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: [" Human:", " AI:"],
        })
            .then((response) => {
                res.json(response.data.choices);
            })
    } catch (error) {
        res.status(401).json({
            error
        })
    }

});

router.get('/user', async function (req, res, next) {
  try {
    const session = await supabase.auth.getUser(req.headers.authorization);
    const user = await supabase.from('users').select().eq('email', session.data.user?.email).single();
    res.json({ ...user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

const port = 3000;

app.listen(port);

module.exports = app;
