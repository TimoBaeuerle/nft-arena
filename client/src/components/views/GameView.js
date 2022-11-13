import React from 'react';
import { Web3Provider } from '../../utils/Web3Context';
import GameEnvironment from '../sections/GameEnvironment';
import '../../assets/css/game.css';

export default function GameView() {
    return (
        <Web3Provider>
            <div className="game-view">
                <GameEnvironment />
            </div>
        </Web3Provider>
    )
}
