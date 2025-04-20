require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/gemini', async (req, res) => {
  const userInput = req.body.message;

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{ parts: [{ text: userInput }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          key: process.env.GEMINI_API_KEY
        }
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    res.json({ response: text });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Error al conectarse con la API de Gemini' });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
