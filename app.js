var express = require('express');
const supabase = require('./supabase');
require('dotenv').config();

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
  apiKey: "sk-proj-3vDaYkleGM3Mib3GnPh4T3BlbkFJ9vz9C5Bebx2EUHEeEXGp",
});
const openai = new OpenAIApi(configuration);

const promt = "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: ";

app.post('/chat', async function (req, res, next) {  // Extracting the user's message from the request body 
  const message = req.body.message;
  try {
    openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user", content: `${promt} ${message}`
      }]
    })
      .then((response) => {
        res.json(response.data.choices[0].message.content);
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
