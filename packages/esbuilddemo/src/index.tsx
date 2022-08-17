// import React from 'react';
import App from './App';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './index.css';
const root = document.getElementById('app') as Element

hydrateRoot(root, <App />)
