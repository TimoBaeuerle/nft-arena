import React from 'react'

export default function TextImage(props) {
    return (
        <div className={"d-flex flex-column flex-md-row text-image " + (props.className || "")}>
            <img src={props.image} alt="Images can not be loaded on your browser" className="w-75 w-md-25 mb-3 mb-md-0"/>
            <div className="ml-md-4">
                <h2>{props.title}</h2>
                <p className="fs-lg">{props.children}</p>
            </div>
        </div>
    )
}
