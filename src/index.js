import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

console.log("React app starting..."); 
const root = createRoot(document.getElementById('root'));
root.render(<App/>);
