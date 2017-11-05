import React from "react";
import {render} from "react-dom";

import MatchProfileContainer from "./containers/MatchProfile.container";

const appContainer = document.getElementById("app");

render(
    <MatchProfileContainer/>,
    appContainer
);