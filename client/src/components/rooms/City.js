import React, { useContext } from 'react';
import { RoomContext } from '../../utils/RoomContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import city from '../../assets/images/city.png';
import '../../assets/css/city.css';

export default function City() {
    const [, switchToRoom] = useContext(RoomContext);

    return (
        <div className="city-room room">
            <div className="universe-background"></div>
            <div className="city-container" >
                <img src={city} alt="Images can not be loaded on your browser" draggable="false" className="city" />
                <div className="interactives position-absolute w-100">
                    <div className="gallery">
                        <button onClick={() => {switchToRoom('gallery')}}>
                            <FontAwesomeIcon icon={faImage} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
