import React from 'react';

export default function Gradient(props) {
    return (
        <div className="position-relative h-100">
            <div className={ props.name + '-gradient position-absolute ' + props.className }></div>
        </div>
    )
}