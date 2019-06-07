import React from 'react';
import ReactJWPlayer from 'react-jw-player';
import {ToastsStore} from "react-toasts";

import "./episodepage.sass";

import EpisodeOptions from "./EpisodeOptions";
import App from "../App";
import EpisodeList from "./EpisodeList";

export default class EpisodePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            episode: null,
            id: null,
            has_player: false,
            playlist: null
        };
        this.getEpisode();
    }

    sendLike = value => {
        let episode = this.state.episode;
        let initialValue = episode.liked;
        episode.liked = value;
        this.setState({episode: episode});
        App.sendPostRequest("episode/like", {episode: this.state.episode.id, liked: value}, true).then(res => {
            console.log("Boas");
            console.log({episode: this.state.episode.id, liked: value});
        }).catch(err => {
            episode.liked = initialValue;
            this.setState({episode: episode});
            ToastsStore.error("Algo de errado não está certo");
        });
    };

    getEpisode() {
        let url = `episode/${this.props.match.params.id}`;
        App.sendGetRequest(url, this.props.is_logged_in).then(res => {
            this.setState({episode: res.data, id: res.data.id}, () => {
                this.getPlaylist();
            });
        });
    }

    getEpisodeInfo() {
        let url = `episode/${this.props.match.params.id}`;
        console.log("Get Episode Info\nIsLoggedIn: " + this.props.is_logged_in);
        App.sendGetRequest(url, this.props.is_logged_in).then(res => {
            this.setState({episode: res.data}, () => {
                this.reloadPlaylist();
            });
            console.log(res.data);
            console.log("Getting episode info");
        });
    }

    getPlaylist() {
        return App.sendGetRequest(`playlist/${this.state.episode.id}`, false).then(res => {
            this.setState({playlist: res.data}, () => {
                return res.data;
            });
        });
    }

    reloadPlaylist() {
        this.getPlaylist().then(res => {
            window.jwplayer("player-container").load(res);
        });
    }

    removePlayer = () => {
        if (this.state.has_player) {
            console.log("Video Removed");
            window.jwplayer("player-container").remove();
        }
    };

    componentDidMount() {
        this.props.history.listen((event, action) => {
            if (action === "POP") {
                this.getEpisodeInfo();
            }
        });
    }

    componentWillUnmount() {
        this.removePlayer();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.getEpisode();
        }
    }

    render() {
        if (this.state.episode !== null) {
            return (
                <div className="episode-page">
                    <div className="spacer"/>
                    <div className="player-episodes-container">
                        <div className="player-misc-wrapper">
                            <div className="player-left-wrapper">
                                <div className="video-loading-container"/>
                                <ReactJWPlayer playerId={`player-container`} playerScript="https://cdn.jwplayer.com/libraries/7OxfLofq.js" playlist={`${process.env.REACT_APP_API_URL}/playlist/${this.state.id}`}
                                               onReady={
                                                   event => {
                                                       this.setState({has_player: true});
                                                       console.log("Hey");
                                                       window.jwplayer().addButton("https://cdn.discordapp.com/attachments/579408811085791233/586509868408635412/Playlist.svg", "Modo de Downs", function () {
                                                           console.log("Button Clicked");
                                                           document.getElementById("player-container").classList.toggle("theater-mode");
                                                           window.jwplayer().resize();
                                                       });

                                                       if (document.querySelectorAll(".video-loading-container").length > 0) {
                                                           document.querySelector(".video-loading-container").style.display = "none";
                                                       }
                                                   }
                                               }
                                               onVideoLoad={
                                                   event => {
                                                       if (parseInt(event.item.id) !== parseInt(this.props.match.params.id)) {
                                                           this.props.history.push(`/v/${event.item.id}`);
                                                           this.getEpisodeInfo();
                                                       }
                                                   }
                                               }
                                               onError={
                                                   event => {
                                                       if (event.code === 224003) {
                                                           if (localStorage.getItem("jwplayer.qualityLabel") === "HD") {
                                                               localStorage.setItem("jwplayer.qualityLabel", "SD");
                                                           } else if (localStorage.getItem("jwplayer.qualityLabel") === "SD") {
                                                               localStorage.setItem("jwplayer.qualityLabel", "HD");
                                                           } else {
                                                               localStorage.setItem("jwplayer.qualityLabel", "SD");
                                                           }
                                                       }
                                                   }
                                               }
                                />
                                <EpisodeOptions episode={this.state.episode} is_logged_in={this.props.is_logged_in} sendLike={this.sendLike}/>
                            </div>
                        </div>
                        <div className="episode-list-container">
                            <EpisodeList playlist={this.state.playlist} episode={this.state.episode}/>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    Nada para ver aqui...
                </div>
            );
        }
    }

}