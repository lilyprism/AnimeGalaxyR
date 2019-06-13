import React from 'react';

import "./episodecontrols.sass";
import {Link} from "react-router-dom";

export default class EpisodeControls extends React.Component {

    render() {
        if (this.props.episode !== null && this.props.anime !== null) {
            return (
                <div className="episode-controls">
                    <Link to={`${this.props.episode.id}`} title="Próximo Episódio" className="episode-control"><i className="fas fa-chevron-right"/></Link>
                    <Link to={`/anime/${this.props.anime.id}`} title={"Anime"} className="episode-control"><i className="fas fa-list-ul"/></Link>
                </div>
            );
        } else {
            return (
                <div className="episode-controls">
                    <Link to={""} className="episode-control" title="Próximo Episódio"><i className="fas fa-chevron-right"/></Link>
                    <Link to={""} className="episode-control" title={"Anime"}><i className="fas fa-list-ul"/></Link>
                </div>
            );
        }
    }

};