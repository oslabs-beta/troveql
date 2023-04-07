import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './components/Dashboard.jsx';
import styles from './styles/main.scss';

const div = document.getElementById('App');
const root = createRoot(div);
root.render(<Dashboard/>);


