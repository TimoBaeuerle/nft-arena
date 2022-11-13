import React from "react";
import { Switch, Route } from 'react-router-dom';
import HomeView from "./components/views/HomeView";
import AirdropView from "./components/views/AirdropView";
import SalespageView from "./components/views/SalespageView";
import GameView from "./components/views/GameView";

export default function App() {
    return (
        <Switch>
            <Route path="/" component={HomeView} exact />
            <Route path="/airdrop" component={AirdropView} />
            <Route path="/sale" component={SalespageView} />
            <Route path="/play" component={GameView} />
            <Route component={HomeView} />
        </Switch>
    );
}
