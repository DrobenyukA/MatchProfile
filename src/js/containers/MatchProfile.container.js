import React, { Component } from 'react';
import update from 'immutability-helper';
import { DragDropContext } from 'react-dnd';
import TouchBackend from 'react-dnd-touch-backend';

import MOCKS from "../mocks";
import PROFILES from "../constants/profiles.constants";
import Profile from "../components/profile.component";
import Draggable from "../components/draggable.component";

import "../../scss/app";

@DragDropContext(TouchBackend({ enableMouseEvents: true }))

export default class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
            [PROFILES.PAUSED]: MOCKS.PAUSED,
            [PROFILES.ACTIVE]: MOCKS.ACTIVE

        }
    }
    addProfile = () => console.log("Add profile");

    submitProfile = () => console.log("Submit profile");

    getProfiles(profiles, category){
        return profiles.map((item, index) => (
                <Profile
                    key={item.id}
                    id={item.id}
                    index={index}
                    title={item.type}
                    length={profiles.length}
                    category={category}
                    onMove={this.moveProfile}
                    description={this.getProfileDescription(item.tags)}
                />
            )
        )
    }

    getProfileDescription = tags => Array.isArray(tags) ? tags.join(", ") : "(An unexpected match is chosen)";

    updateCategory(dragged, hovered, profile) {
        this.setState(
            update(this.state, {
                [dragged.category]: {
                    $splice: [[dragged.index, 1], [hovered.index, 0, profile]],
                },
            }),
        )
    }

    changeCategory(dragged, hovered, profile) {
        const oldState = this.state[hovered.category];
        /** Depend on category it will inject our profile into stat or end of the list  **/
        const newState = dragged.category === PROFILES.ACTIVE ? [profile, ...oldState] : [...oldState, profile];
        this.setState(
            update(this.state, {
                /** remove profile from current category list **/
                [dragged.category]: {
                    $splice: [[dragged.index, 1]],
                },
                /** add profile into new category list **/
                [hovered.category]: {
                    $set: newState,
                }
            }),
        );
    }

    moveProfile = (dragged, hovered) => {
        const profile = this.state[dragged.category][dragged.index];

        if (dragged.category === hovered.category){
            this.updateCategory(dragged, hovered, profile);
        } else {
            this.changeCategory(dragged, hovered, profile);
        }
    };

    render() {
        const { [PROFILES.PAUSED]:inPull, [PROFILES.ACTIVE]:prioritized } = this.state;
        return (
            <div className="app-container">
                <header>
                    <h1>Match profile</h1>
                    <div className="control">
                        <button className="btn btn-add" onClick={this.addProfile}>
                            +
                        </button>
                    </div>
                </header>
                <div className="profiles">
                    { this.getProfiles(prioritized, PROFILES.ACTIVE)}
                </div>
                <hr/>
                <div className="profiles paused">
                    { this.getProfiles(inPull, PROFILES.PAUSED)}
                </div>
                <button className="btn btn-submit" onClick={this.submitProfile}>
                    Submit profile
                </button>
                <Draggable />
            </div>
        )
    }
}
