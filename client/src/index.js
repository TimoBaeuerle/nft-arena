import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import './assets/css/index.css';
import "@babel/polyfill";
import App from './App';

ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('app')
);

//View height handling
var vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', vh + 'px');
window.addEventListener('resize', () => {
    var newVH = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', newVH + 'px');
});