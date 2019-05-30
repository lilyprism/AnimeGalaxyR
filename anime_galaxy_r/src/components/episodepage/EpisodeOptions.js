import React from 'react';

import "./episodeoptions.sass";

class LikeDislike extends React.Component {

    render() {
        return (
            <div className="like-dislike-container">
                <div className="episode-option"><i className="fas fa-thumbs-up fa-fw"/></div>
                <div className="episode-option"><i className="fas fa-thumbs-down fa-fw"/></div>
            </div>
        );
    }

}

class Report extends React.Component {

    render() {
        return (
            <div className="report-container">
                <div className="episode-option"><i className="fas fa-flag fa-fw"/></div>
            </div>
        );
    }

}

export default class EpisodeOptions extends React.Component {

    render() {
        return (
            <div className="episode-options-container">
                <h1 className="title"><span>{this.props.episode.anime.name} - Episode {this.props.episode.number}</span></h1>
                <LikeDislike/>
                <Report/>
            </div>
        );
    }

};