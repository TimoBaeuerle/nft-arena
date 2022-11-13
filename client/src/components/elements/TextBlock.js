import React from 'react';

export default function TextBlock(props) {
    return (
        <div className={ (props.className || '') + ' d-flex ' + (props.aligned === 'center' ? 'justify-center text-center' : '')}>
            {props.children}
        </div>
    )
}
