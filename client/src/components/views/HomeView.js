import React, { useState }  from 'react';
import Hero from '../sections/Hero';
import Explore from '../sections/Explore';
import VolumeButton from '../elements/VolumeButton';
import '../../assets/css/game.css';

export default function HomeView() {
    const [explore, setExplore] = useState(false);

    return (
        <div className="home-view">
            <Hero setExplore={setExplore} />
            {explore &&
                <Explore />
            }
            <VolumeButton />
        </div>
    )
}
