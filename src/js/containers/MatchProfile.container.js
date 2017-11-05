import React, { Component } from 'react';
import update from 'immutability-helper';
import { DragDropContext } from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';

import PROFILES from "../constants/profiles.constants";

import Profile from "../components/profile.component";
import Draggable from "../components/draggable.component";

import "../../scss/app";

@DragDropContext(TouchBackend({ enableMouseEvents: true }))

export default class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
            [PROFILES.PAUSED]: [
                {
                    id: 4,
                    type: "Designer",
                    tags: ["Hyper Island", "Female"]

                },
                {
                    id: 5,
                    type: "Surprise me",
                    tags: null
                },
                {
                    id: 6,
                    type: "Growth hacker",
                    tags: ["Startup", "25-35 years old"]
                }
            ],
            [PROFILES.ACTIVE]: [
                {
                    id: 1,
                    type: "Internations",
                    tags: [],
                },
                {
                    id: 2,
                    type: "Designer",
                    tags: ["Freelancer", "Female"],
                },
                {
                    id: 3,
                    type: "Product owner",
                    tags: ["Startup", "Corporate"],
                }
            ]

        }
    }
    addProfile = () => {
      console.log("Add profile");
    };

    submitProfile = () => {
        console.log("Submit profile");
    };

    getProfileDescription(tags){
        if (Array.isArray(tags)) return tags.join(", ");
        return "(An unexpected match is chosen)";
    }

    updateCategory(dragged, hovered, profile) {
        this.setState(
            update(this.state, {
                [dragged.category]: {
                    $splice: [[dragged.index, 1], [hovered.index, 0, profile]],
                },
            }),
        )
    }

    changeCategory(dragged, hovered, profile){
        const oldState = this.state[hovered.category];
        /** Depend on category we will inject our profile into stat or end of the list  **/
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
        )

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
        const { [PROFILES.PAUSED]:paused, [PROFILES.ACTIVE]:active } = this.state;
        return (
            <div className="container">
                <h1>Match profile</h1>
                <button onClick={this.addProfile}>Add Profile</button>
                <div className="profiles prioritized">
                    Prioritized Profiles
                    {
                        active.map((item, index) => (
                            <Profile
                                key={item.id}
                                id={item.id}
                                index={index}
                                title={item.type}
                                length={active.length}
                                category={PROFILES.ACTIVE}
                                onMove={this.moveProfile}
                                description={this.getProfileDescription(item.tags)}
                            />
                            )
                        )
                    }
                </div>
                <hr/>
                <div className="profiles">
                    Rest Profiles
                    {
                        paused.map((item, index) => (
                            <Profile
                                key={item.id}
                                id={item.id}
                                index={index}
                                title={item.type}
                                category={PROFILES.PAUSED}
                                onMove={this.moveProfile}
                                description={this.getProfileDescription(item.tags)}
                            />
                            )
                        )
                    }
                </div>
                <button onClick={this.submitProfile}>Submit profile</button>
                <Draggable/>
            </div>
        )
    }
}
