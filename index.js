import express from 'express';
import { WorkOS } from '@workos-inc/node';
import cors from 'cors';
import routes from './routes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/', routes);

export const WORKOS_API_KEY = new WorkOS(process.env.WORKOS_API_KEY);
export const WORKOS_CLIENT_ID = new WorkOS(process.env.WORKOS_CLIENT_ID);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
