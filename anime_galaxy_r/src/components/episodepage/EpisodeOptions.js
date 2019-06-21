import React from 'react';

import "./episodeoptions.sass";

import Report from "../Report";
import LikeDislike from "./LikeDislike";


export default class EpisodeOptions extends React.Component {
    render() {
        return (
            <div className="episode-options-container">
                <h1 className="title" title={`${this.props.episode.anime.name} - Episódio ${this.props.episode.number}`}><span>{this.props.episode.anime.name} - Episódio {this.props.episode.number}</span></h1>
                <div className="options-container">
                    <LikeDislike episode={this.props.episode} sendLike={this.props.sendLike} disabled={!this.props.is_logged_in} getEpisodeInfo={this.props.getEpisodeInfo}/>
                    <span className="episode-option"><i className="fas fa-eye"/> {this.props.episode.views}</span>
                    <div className="episode-option">
                        <Report type={"video"} episode={this.props.episode}/>
                    </div>
                </div>
            </div>
        );
    }
};