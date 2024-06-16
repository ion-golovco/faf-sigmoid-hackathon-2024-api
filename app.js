var express = require('express');
const supabase = require('./supabase');
require('dotenv').config();

const { Configuration, OpenAIApi } = require("openai");

var cors = require("cors");
var app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    // Attempt to sign in the user
    const { data, error } = await supabase.from('users').select().eq('email', email).single();
    if (error) {
      res.status(401).json({ error })
    }
    if (data.password === password) {
      // User successfully logged in
      res.json({
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
  const { data: foundUser } = await supabase.from('users').select().eq('email', email).single()

  if (foundUser !== null) { res.status(400).json({ error: 'error' }) }
  else {
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
  }
});


const configuration = new Configuration({
  apiKey: "sk-proj-3vDaYkleGM3Mib3GnPh4T3BlbkFJ9vz9C5Bebx2EUHEeEXGp",
});
const openai = new OpenAIApi(configuration);

const prompt = "Ești un asistent de vânzări virtual pentru un magazin online de electronice. Scopul tău este să înțelegi nevoile clientului și să recomanzi cele mai bune produse care se potrivesc cerințelor lor. Fii prietenos, profesionist și util în toate răspunsurile tale. Asigură-te că răspunsurile tale sunt clare, concise și se concentrează pe găsirea celui mai bun produs pentru client.";

app.post('/chat', async function (req, res, next) {
  const message = req.body.message;
  const category = req.body.category;
  const { data } = await supabase.from('products').select().eq('categories', category);
  const productsAi = data.map(({id, name, description}) => ({id, name, description}))
  try {
    openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user", content: `initial prompt:${prompt} ... recommended products ${JSON.stringify(productsAi)} ... last 3 messages: ${message} ... return a small greeting/info about your choices(name,etc) and product ids (id property) of reccomended products in the style of [1, 5, 12, 67]`
      }]
    })
      .then((response) => {
        const chatResponse = response.data.choices[0].message.content
        const ids = chatResponse.split('[')?.filter((r, index) => index % 2 !== 0).map((r)=> r.split(']')?.filter((_, index) => index % 2 == 0))?.flat()[0].split(',')?.map(Number)
        
        res.json(
          {
            message: chatResponse,
            products: data.filter((p)=> ids.includes(p.id))
          }
        )
      })
  } catch (error) {
    res.status(401).json({
      error
    })
  }

});

app.post('/user', async function (req, res, next) {
  try {
    const email = req.body.email;
    console.log(email);
    if (!email) res.status(400);
    const { data, error } = await supabase.from('users').select().eq('email', email).single();
    if (error) {
      res.status(401).json({ error })
    }
    res.json({
      username: data.username,
      email: data.email
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.get('/', function (req, res) {
  res.json({ name: 'helou' })
})

app.listen(3000)


module.exports = app;
