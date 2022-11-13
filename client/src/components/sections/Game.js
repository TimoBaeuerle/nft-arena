import React, { useContext, useEffect } from 'react';
import { RoomContext } from '../../utils/RoomContext';
import { setPortrait } from '../../utils/roomHelper';
import GameHeader from './GameHeader';
import City from '../rooms/City';
import Gallery from '../rooms/Gallery';

export default function Game() {
    const [location] = useContext(RoomContext);

    useEffect(() => {
        window.addEventListener('resize', () => {
            setPortrait();
        });
    }, []);

    useEffect(() => {
        setPortrait();
    }, [location]);

    return (
        <div className="game-section">
            <GameHeader />
            {location == 'city' &&
               <City />
            }
            {location == 'gallery' &&
                <Gallery />
            }
        </div>
    )
}
