import React from 'react'
import Modal from './Modal';

export default function UnderConstruction() {
    return (
        <Modal
            id="underConstruction"
            open={true}
            title="We are working on this page"
            discord={process.env.REACT_APP_DISCORD}
            telegram={process.env.REACT_APP_TELEGRAM}
            twitter={process.env.REACT_APP_TWITTER}
            whitepaper={process.env.REACT_APP_WHITEPAPER}
            backLink="/"
            backLinkText="Back to Home"
        />
    )
}
