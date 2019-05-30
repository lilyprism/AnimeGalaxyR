import React from 'react';
// import axios from 'axios';

import "./episodelist.sass";

class EpisodeListItem extends React.Component {

    render() {
        return (
            <li className="episode-list-item">
                <div className="episode-list-item-body">
                    <img className="episode-list-item-img" src={this.props.episode.anime.image} alt="Anime thumbnail"/>
                    <div>
                        <p>
                            Hello Darkness My Old Friend
                        </p>
                    </div>
                </div>
            </li>
        );
    }

}

export default class EpisodeList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            episodes: [
                {
                    id: 1,
                    number: 1,
                    anime: {
                        name: "Fairy Tail",
                        description: "Fire Wizard Story Here",
                        image: "http://via.placeholder.com/200"
                    }
                }, {
                    id: 2,
                    number: 2,
                    anime: {
                        name: "Fairy Tail",
                        description: "Fire Wizard Story Here",
                        image: "http://via.placeholder.com/200"
                    }
                }, {
                    id: 3,
                    number: 3,
                    anime: {
                        name: "Fairy Tail",
                        description: "Fire Wizard Story Here",
                        image: "http://via.placeholder.com/200"
                    }
                }, {
                    id: 4,
                    number: 4,
                    anime: {
                        name: "Fairy Tail",
                        description: "Fire Wizard Story Here",
                        image: "http://via.placeholder.com/200"
                    }
                }, {
                    id: 5,
                    number: 5,
                    anime: {
                        name: "Fairy Tail",
                        description: "Fire Wizard Story Here",
                        image: "http://via.placeholder.com/200"
                    }
                }, {
                    id: 6,
                    number: 6,
                    anime: {
                        name: "Fairy Tail",
                        description: "Fire Wizard Story Here",
                        image: "http://via.placeholder.com/200"
                    }
                }, {
                    id: 7,
                    number: 7,
                    anime: {
                        name: "Fairy Tail",
                        description: "Fire Wizard Story Here",
                        image: "http://via.placeholder.com/200"
                    }
                }, {
                    id: 8,
                    number: 8,
                    anime: {
                        name: "Fairy Tail",
                        description: "Fire Wizard Story Here",
                        image: "http://via.placeholder.com/200"
                    }
                },
            ]
            // episodes: []
        }
    }

    getEpisodesInRange() {

    }

    render() {
        if (this.state.episodes.length > 0) {
            return (
                <ul className="episode-list">
                    {this.state.episodes.map(function (episode, index) {
                        return <EpisodeListItem episode={episode} key={episode.id}/>
                    })}
                </ul>
            );
        } else {
            return (
                <div>No Episodes To Show</div>
            );
        }
    }

};