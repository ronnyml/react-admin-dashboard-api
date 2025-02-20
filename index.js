import express from 'express';
import cors from 'cors';
import routes from './routes.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
