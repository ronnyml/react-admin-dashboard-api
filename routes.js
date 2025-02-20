import express from 'express';
import stockPrices from './stockPriceData.js';
import { WORKOS_CLIENT_ID } from './index.js';

const router = express.Router();

const handleRequest = async (req, res, action) => {
  try {
    const result = await action(req.body);
    res.json(result);
  } catch (error) {
    console.error(`${req.path} failed:`, error);
    res.status(error.statusCode || 500).json({ error: error.message || 'An error occurred' });
  }
};

router.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Dashboard API Documentation</title></head>
      <body>
        <h1>Dashboard API</h1>
        <h3>Endpoints:</h3>
        <ul>
          <li>
            <strong>POST /api/sign-in</strong><br>
            Authenticates a user with email and password.<br><br>
            <strong>Requires JSON body:</strong><br>
            <pre>
              {
                "email": "user@example.com",
                "password": "password123"
              }
                          </pre>
                        </li>
                        <br>
                        <li>
                          <strong>POST /api/sign-out</strong><br>
                          Logs out a user using sessionId.<br><br>
                          <strong>Requires JSON body:</strong><br>
                          <pre>
              {
                "sessionId": "session-id"
              }
            </pre>
          </li>
          <br>
          <li>
            <strong>GET <a href='api/stock-price/'>api/stock-price/</a></strong><br>
            Retrieves AAPL (Apple) end-of-day stock prices for the past 12 months.<br><br>
            <strong>Example Response:</strong><br>
            <pre>
              {
                "stock": "AAPL",
                "prices": [
                  {
                    "date": "2025-01-01",
                    "open": 165.20,
                    "high": 170.50,
                    "low": 164.30,
                    "close": 168.90,
                    "volume": 12500000
                  }
                ]
              }
            </pre>
          </li>
        </ul>
      </body>
    </html>
  `);
});

router.post('/api/sign-in', (req, res) => {
  handleRequest(req, res, async ({ email, password }) => {
    const user = await workos.userManagement.authenticateWithPassword({
      email,
      password,
      clientId: WORKOS_CLIENT_ID,
    });
    return { user };
  });
});


router.post('/api/sign-out', (req, res) => {
  handleRequest(req, res, async ({ sessionId }) => {
    await workos.userManagement.getLogoutUrl({ sessionId, returnTo: '/' });
    return { message: 'User signed out successfully' };
  });
});


router.get('/api/stock-price', (req, res) => {
  handleRequest(req, res, async () => {
    if (!stockPrices || !stockPrices.prices || stockPrices.prices.length === 0) {
      throw new Error("Stock Price data is unavailable.");
    }
    return stockPrices;
  });
});

export default router;
