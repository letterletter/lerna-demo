import React from 'react';
import App from './App';
import { createRoot } from 'react-dom/client';
import './index.css';
const root = createRoot(document.getElementById('app') as Element)

root.render(<div><div>Hello World</div><App /></div>)
