import React from 'react';
import ReactJWPlayer from 'react-jw-player';

import "./episodepage.sass";
import CardLayout from "../cardlayout/CardLayout";
import * as ReactDOM from "react-dom";
import RequestUtilities from "../../util/RequestUtilities";

export default class EpisodePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            episode: null
        };
        this.getEpisodeInfo();
    }

    getEpisodeInfo = () => {
        RequestUtilities.sendGetRequest(`episode/${this.props.match.params.id}`).then(res => {
            this.setState({episode: res.data});
        }).catch(err => {
            console.log(err.response);
        });
    };

    getPlaylist = () => {

    };

    handleOnPlay = event => {
        let this_el = ReactDOM.findDOMNode(this);

        if (this_el instanceof HTMLElement) {
            this_el.querySelector(".episode-name").classList.add("hide");
        }
    };

    handleOnPause = event => {
        let this_el = ReactDOM.findDOMNode(this);

        if (this_el instanceof HTMLElement) {
            this_el.querySelector(".episode-name").classList.remove("hide");
        }
    };

    render() {
        return (
            <div className="episode-page">
                <div className="gradient-container">
                    <div className="spacer"/>
                    <div className="breakpoint-container">
                        <div className="player-ad-container">
                            <div className="player-area">
                                <div className="player-container">
                                    {
                                        this.state.episode !== null ?
                                            <div>
                                                <ReactJWPlayer playerId={"episode-player"} className="player" playerScript="https://cdn.jwplayer.com/libraries/7OxfLofq.js" aspectRatio={"16:9"} playlist={`${process.env.REACT_APP_API_URL}/episode/playlist/${this.props.match.params.id}`} onPlay={this.handleOnPlay} onResume={this.handleOnPlay}/>
                                                <div className="episode-name">{`${this.state.episode != null ? this.state.episode.season.anime.name : ""} - Episódio ${this.state.episode != null ? this.state.episode.number : ""}`}</div>
                                            </div>
                                            :
                                            ""
                                    }
                                </div>
                                <div className="episode-player-options">
                                    <div className="episode-views-container">
                                        <span className="episode-views">{this.state.episode != null ? this.state.episode.views.toString().replace(/(\d+?)(?=(\d{3})+(?!\d)|$)/g, "$&,").slice(0, -1) : ""} Visualizações</span>
                                    </div>
                                    <div className="anime-name-container">
                                        <span className="anime-name">{this.state.episode != null ? this.state.episode.season.anime.name : ""}</span>
                                    </div>
                                    <div className="like-dislike-container">
                                        <div className="icon-circle">
                                            <i className="fas fa-thumbs-up fa-fw like-icon"/>
                                        </div>
                                        <div className="like-number">
                                            {this.state.episode != null ? this.state.episode.likes : ""}
                                        </div>
                                        <div className="icon-circle">
                                            <i className="fas fa-thumbs-down fa-fw dislike-icon"/>
                                        </div>
                                        <div className="dislike-number">
                                            {this.state.episode != null ? this.state.episode.dislikes : ""}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="side-container">
                                <div className="side">
                                    <div className="adblock-message">Pow, tira o adblock murcão</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="spacer"/>
                </div>
                <div className="border-bottom-red"/>
                <div className="gradient-container">
                    <div className="breakpoint-container">
                        <h2 className="bg-title">
                            <div className="pless-title">
                                <span>Próximos Episódios</span>
                            </div>
                        </h2>
                        <CardLayout/>
                    </div>
                    <div className="spacer"/>
                </div>
                <div className="border-bottom-red"/>
                <div className="gradient-container">
                    <div className="breakpoint-container">
                        <h2 className="bg-title">
                            <div className="pless-title">
                                <span>Comentários</span>
                            </div>
                        </h2>
                    </div>
                    <div className="spacer"/>
                </div>
            </div>
        );
    }

};