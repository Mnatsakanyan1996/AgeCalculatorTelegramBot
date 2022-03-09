require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const { TOKEN, SERVER_URL } = process.env;

const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;

const app = express();
app.use(bodyParser.json());

const init = async () => {
  const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
  console.log('init', res.data);
};

app.post(URI, async (req, res) => {
  console.log('post', req.body);
  try {
    if (req.body.message) {
      const { id, first_name } = req.body.message.chat;
      const text = req.body.message.text;
      let message;

      if (!Number(text)) {
        message = 'Խնդրում եմ ուղարկել ճիշտ ֆորմատով';
      }

      if (!!Number(text)) {
        message = new Date().getFullYear() - Number(text);
      }

      if (text === '/start') {
        message = `Ո՞ր թվականին եք ծնվել ${first_name} ջան`
      }

      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: id,
        text: message,
      });
    }
  } catch (error) {
    console.log('error: ', error);
  }

  return res.send();
});

app.listen(process.env.PORT || 4000, async () => {
  console.log('🚀 app running on port', process.env.PORT || 4000);
  await init();
});
