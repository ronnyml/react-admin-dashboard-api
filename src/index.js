import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { WorkOS } from '@workos-inc/node';
import router from './routes.js';

dotenv.config();

const WORKOS_API_KEY = process.env.WORKOS_API_KEY;
const WORKOS_CLIENT_ID = process.env.WORKOS_CLIENT_ID;
const workos = new WorkOS(WORKOS_API_KEY);

const app = express();
app.use(express.json());
app.use(cors());

app.use('/', router(workos, WORKOS_CLIENT_ID));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { WORKOS_API_KEY, WORKOS_CLIENT_ID, workos };
export default app;
