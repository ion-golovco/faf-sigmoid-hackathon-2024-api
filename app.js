var express = require('express');
var dotenv = require('dotenv');
const supabase = require('./supabase');
const crypto = require('crypto')

const { Configuration, OpenAIApi } = require("openai");

var app = express();

app.use(express.json());

app.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Attempt to sign in the user
    const { data, error } = await supabase.from('users').select().eq('email', email).single();
    if (error) {
      res.status(401).json({ error })
    }

    if (data.password === password) {
      // User successfully logged in
      res.status({
        ...data
      });
    } else {
      res.status(401)
    }

  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.post('/register', async (req, res, next) => {
  const { email, password, username } = req.body;

  try {
    const { data, error } = await supabase.from('users').insert({
      email,
      password,
      username
    }).select().single();

    if (error) {
      res.status(401).json({ error })
    }

    res.status(200).json({
      ...data
    })

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});
const openai = new OpenAIApi(configuration);

const conversationContextPrompt = "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: ";

app.post('/chat', async function (req, res, next) {  // Extracting the user's message from the request body 
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

app.get('/user', async function (req, res, next) {
  try {
    const email = req.body.email;
    if (!email) res.status(400);
    const user = await supabase.from('users').select().eq('email', email).single();
    res.json({ ...user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.get('/', function (req, res) {
  res.json({ name: 'helou' })
})

app.listen(3000)


module.exports = app;
