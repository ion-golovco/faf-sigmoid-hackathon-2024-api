var express = require('express');
var router = express.Router();
const openAI = require('openai');
var dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require("openai");

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

module.exports = router;