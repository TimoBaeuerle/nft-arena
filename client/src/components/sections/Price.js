import React from 'react';
import prices from '../../assets/images/prices.png';
import '../../assets/css/price.css';

export default function Price() {
    return (
        <div className="price-section">
            <img src={prices} className="" alt="Images can not be loaded on your browser" />
        </div>
    )
}