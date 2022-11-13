import React from 'react';

export default function Headline(props) {
    return (
        <div className={ (props.className || '') + ' d-flex ' + (props.aligned === 'center' ? ' justify-center' : '') }>
            <h2>{props.title}</h2>
        </div>
    )
}
