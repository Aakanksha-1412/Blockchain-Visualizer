/**
  Arbitrum Builder Pods - Blockchain Visualizer
  Backend: server.ts
  Custom Express Server to host Vanilla HTMLcss/JS Assets
*/

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Resolve directories depending on dev (root) vs prod (dist/) structures
const isProd = process.env.NODE_ENV === 'production' || __dirname.includes('dist');
const basePath = isProd ? __dirname : __dirname;

// Express JSON middleware
app.use(express.json());

// Serve Static Assets with explicit route mapping
app.use('/css', express.static(path.join(basePath, 'css')));
app.use('/js', express.static(path.join(basePath, 'js')));
app.use('/images', express.static(path.join(basePath, 'images')));

// Primary Document Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(basePath, 'index.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(basePath, 'index.html'));
});

app.get('/concepts.html', (req, res) => {
  res.sendFile(path.join(basePath, 'concepts.html'));
});

app.get('/prices.html', (req, res) => {
  res.sendFile(path.join(basePath, 'prices.html'));
});

app.get('/simulator.html', (req, res) => {
  res.sendFile(path.join(basePath, 'simulator.html'));
});

// Fallback simple redirect to home index
app.use((req, res) => {
  res.status(404).sendFile(path.join(basePath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server starting on port ${PORT}...`);
  console.log(`Local link: http://localhost:${PORT}`);
});
