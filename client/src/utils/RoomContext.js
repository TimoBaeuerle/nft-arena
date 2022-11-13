import React, {useState, createContext,} from 'react';
import { switchRoom } from './roomHelper';

export const RoomContext = createContext();

export const RoomProvider = ({children}) => {
    const [location, setLocation] = useState(window.sessionStorage.getItem('location') ? window.sessionStorage.getItem('location') : 'city');

    const setLocationAndSessionStorage = (newState) => {
        window.sessionStorage.setItem('location', newState);
        setLocation(newState);
    }

    const switchToRoom = async (room) => {
        await switchRoom();
        setLocationAndSessionStorage(room);
    }

    return (
        <RoomContext.Provider value={[location, switchToRoom]}>
            {children}
        </RoomContext.Provider>
    );
}