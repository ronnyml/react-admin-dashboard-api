import express from 'express';
import { WorkOS } from '@workos-inc/node';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const workos = new WorkOS(process.env.WORKOS_API_KEY);

const handleRequest = async (req, res, action) => {
  try {
    const result = await action(req.body);
    res.json(result);
  } catch (error) {
    console.error(`${req.path} failed:`, error);
    res.status(error.statusCode || 500).json({ error: error.message || 'An error occurred' });
  }
};

app.get('/', (req, res) => {
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
            { "email": "user@example.com", "password": "password123" }
          </li>
          <br>
          <li>
            <strong>POST /api/sign-out</strong><br>
            Logs out a user using sessionId.<br><br>
            <strong>Requires JSON body:</strong><br>
            { "sessionId": "session-id" }
          </li>
        </ul>
      </body>
    </html>
  `);
});

app.post('/api/sign-in', (req, res) => {
  handleRequest(req, res, async ({ email, password }) => {
    const user = await workos.userManagement.authenticateWithPassword({
      email,
      password,
      clientId: process.env.WORKOS_CLIENT_ID,
    });
    return { user };
  });
});

app.post('/api/sign-out', (req, res) => {
  handleRequest(req, res, async ({ sessionId }) => {
    await workos.userManagement.getLogoutUrl({ sessionId, returnTo: '/' });
    return { message: 'User signed out successfully' };
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
