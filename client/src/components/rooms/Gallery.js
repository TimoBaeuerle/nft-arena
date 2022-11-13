import React, { useContext } from 'react';
import { RoomContext } from '../../utils/RoomContext';

export default function Gallery() {
    const [, switchToRoom] = useContext(RoomContext);

    return (
        <div className="gallery-room room">
            <div>
                <span>Welcome to Gallery</span><br />
                <button onClick={() => {switchToRoom('city')}}>Back to City</button>
            </div>
        </div>
    )
}
