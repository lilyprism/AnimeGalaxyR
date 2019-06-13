import React from 'react';

import "./episodeoptions.sass";
import Report from "../Report";

class LikeDislike extends React.Component {

    render() {
        if (this.props.episode.liked === true) {
            return (
                <div className="like-dislike-container">
                    <div className="episode-option chosen" onClick={() => this.props.sendLike(null)}><i className="fas fa-thumbs-up fa-fw"/></div>
                    <div className="episode-option" onClick={() => this.props.sendLike(false)}><i className="fas fa-thumbs-down fa-fw"/></div>
                </div>
            );
        } else if (this.props.episode.liked === false) {
            return (
                <div className="like-dislike-container">
                    <div className="episode-option" onClick={() => this.props.sendLike(true)}><i className="fas fa-thumbs-up fa-fw"/></div>
                    <div className="episode-option chosen" onClick={() => this.props.sendLike(null)}><i className="fas fa-thumbs-down fa-fw"/></div>
                </div>
            );
        } else {
            return (
                <div className="like-dislike-container">
                    <div className="episode-option" onClick={() => this.props.sendLike(true)}><i className="fas fa-thumbs-up fa-fw"/></div>
                    <div className="episode-option" onClick={() => this.props.sendLike(false)}><i className="fas fa-thumbs-down fa-fw"/></div>
                </div>
            );
        }
    }

}

export default class EpisodeOptions extends React.Component {
    render() {
        return (
            <div className="episode-options-container">
                <h1 className="title"><span>{this.props.episode.anime.name} - Episódio {this.props.episode.number}</span></h1>
                <div className="options-container">
                    {this.props.is_logged_in ? <LikeDislike episode={this.props.episode} sendLike={this.props.sendLike}/> : ""}
                    <div className="episode-option">
                        <Report type={"video"} episode={this.props.episode}/>
                    </div>
                    <span className="episode-option">{this.props.episode.views} Views</span>
                </div>
            </div>
        );
    }
};