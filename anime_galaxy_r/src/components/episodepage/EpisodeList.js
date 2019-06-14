import React from 'react';

import "./episodelist.sass";
import {Link} from "react-router-dom";

class EpisodeListItem extends React.Component {

    render() {
        return (
            <li className="episode-list-item">
                <Link to={`/v/${this.props.episode.id}`}>
                    <div className="episode-list-item-body">
                        <img className="episode-list-item-img" src={this.props.episode.thumbnail} alt="Anime thumbnail"/>
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

    render() {
        if (this.props.playlist === null) {
            return (
                <div className="py-2 text-justify">Nada para ver aqui</div>
            );
        } else if (this.props.playlist.length > 0) {
            return (
                <ul className="episode-list">
                    {this.props.playlist.map((episode, index) => {
                        return <EpisodeListItem selected={episode.id === this.props.episode.id} episode={episode} key={episode.id}/>
                    })}
                </ul>
            );
        } else {
            return <div className="py-2 text-justify">Não existem mais episódios. Este anime ou está acabado ou ainda não saíram mais episódios</div>
        }
    }

};