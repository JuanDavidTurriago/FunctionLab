import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MathJaxContext } from 'better-react-mathjax';
import App from './App';
import './styles.css';

const mathJaxConfig = {
  loader: { load: ['input/tex', 'output/chtml'] },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MathJaxContext config={mathJaxConfig}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MathJaxContext>
  </React.StrictMode>,
);
