import express from 'express';
import axios from 'axios';

const app = express();

app.get('/api/proxy', async (req, res) => {
  const { authkey, searchdate, data } = req.query;
  if (!authkey || !searchdate || !data) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  const apiUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${authkey}&searchdate=${searchdate}&data=${data}`;

  try {
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling external API:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
