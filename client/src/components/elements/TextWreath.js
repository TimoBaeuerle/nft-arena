import React from "react";
import '../../assets/css/textwreath.css';

export default function TextWreath(props) {
    return (
        <div className="wreath-container">
            <div>
                <h3>{props.children}</h3>
            </div>
        </div>
    );
}