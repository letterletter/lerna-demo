import React from 'react';
import App from './App';
import AppHome from './AppNew';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root') as Element)

root.render(<AppHome />)
