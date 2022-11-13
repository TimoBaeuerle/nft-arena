import React, { useContext, useEffect } from 'react';
import { Web3Context } from '../../utils/Web3Context';
import { RoomProvider } from '../../utils/RoomContext';
import Connect from '../rooms/Connect';
import Game from '../sections/Game';
import VolumeButton from '../elements/VolumeButton';
import submit from '../../assets/music/sound-submit.mp3';

export default function GameEnvironment() {
    const [web3State] = useContext(Web3Context);

    return (
        <div className="game-environment">
            {web3State.isConnected &&
                <RoomProvider>
                    <Game />
                </RoomProvider>
            }
            {!web3State.isConnected &&
                <Connect title="Welcome to Niftalis" open={true} closable={false} ingame={true} info="Currently the gates only open to people who have a Multiverse Key. Connect your wallet to prove ownership of a Multiverse Key." />
            }
            <div id="room-switch"></div>
            <audio id="game-bgm" src="" type="audio/mpeg" autoPlay loop></audio>
            <audio id="sound-submit" src={submit} type="audio/mpeg"></audio>
            <VolumeButton />
        </div>
    )
}
