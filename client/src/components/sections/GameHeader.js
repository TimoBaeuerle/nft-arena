import React from 'react';
import WalletStatus from '../elements/WalletStatus';

export default function GameHeader() {
    return(
        <div className="gameheader-section position-fixed layer-3">
            <div className="d-flex align-center justify-end px-1 py-1">
                <WalletStatus />
            </div>
        </div>
    )
}