import React from "react";
import {render} from "react-dom";

import MatchProfile from "./containers/MatchProfile.container";

const appContainer = document.getElementById("app");

render(
    <MatchProfile/>,
    appContainer
);