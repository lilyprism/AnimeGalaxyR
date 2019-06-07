import React from 'react';
// import axios from 'axios';

import "./episodelist.sass";
import {Link} from "react-router-dom";

class EpisodeListItem extends React.Component {

    constructor(props) {
        super(props);

        console.log(this.props.selected);
        console.log(this.props.episode.title);
    }

    render() {
        return (
            <li className="episode-list-item">
                <Link to={`/v/${this.props.episode.id}`}>
                    <div className="episode-list-item-body">
                        <img className="episode-list-item-img" src={this.props.episode.thumbnail} alt="Anime thumbnail"/>
                        {/*{this.props.selected ? <i className="fas fa-play playing-icon fa-fw"/> : ""}*/}
                        <div className="episode-list-item-text">
                            <p>
                                {this.props.episode.title}
                            </p>
                        </div>
                    </div>
                </Link>
            </li>
        );
    }

}

export default class EpisodeList extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.playlist !== null) {
            return (
                <ul className="episode-list">
                    {this.props.playlist.map((episode, index) => {
                        return <EpisodeListItem selected={episode.id === this.props.episode.id} episode={episode} key={episode.id}/>
                    })}
                </ul>
            );
        } else {
            return (
                <div>Nada para ver aqui</div>
            );
        }
    }

};