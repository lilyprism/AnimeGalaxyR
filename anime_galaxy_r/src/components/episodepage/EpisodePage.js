import React from 'react';
import ReactJWPlayer from 'react-jw-player';
import {ToastsStore} from "react-toasts";

import "./episodepage.sass";

import EpisodeOptions from "./EpisodeOptions";
import EpisodeList from "./EpisodeList";
import CommentSection from "./CommentSection";
import RequestUtilities from "../../util/RequestUtilities";
import AnimeDetails from "./AnimeDetails";
import EpisodeControls from "./EpisodeControls";

export default class EpisodePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            episode: null,
            id: null,
            has_player: false,
            playlist: [],
            comments: []
        };
        this.getEpisode();
    }

    sendLike = value => {
        let episode = this.state.episode;
        let initialLiked = episode.liked;
        let initialLikes = episode.likes;
        let initialDislikes = episode.dislikes;

        if (value === true) {
            episode.likes += 1;
            if (episode.liked === false) {
                episode.dislikes -= 1;
            }
        } else if (value === false) {
            episode.dislikes += 1;
            if (episode.liked === true) {
                episode.likes -= 1;
            }
        } else {
            if (episode.liked === true) {
                episode.likes -= 1;
            } else if (episode.liked === false) {
                episode.dislikes -= 1;
            }
        }
        episode.liked = value;

        this.setState({episode: episode});
        RequestUtilities.sendPostRequest("episode/like", {episode: this.state.episode.id, liked: value}, true).then(res => {
            console.log(res.data);
        }).catch(err => {
            episode.liked = initialLiked;
            episode.likes = initialLikes;
            episode.dislikes = initialDislikes;
            this.setState({episode: episode});
            ToastsStore.error("Algo de errado não está certo o/");
        });
    };

    getEpisode() {
        let url = `episode/${this.props.match.params.id}`;
        RequestUtilities.sendGetRequest(url, this.props.is_logged_in).then(res => {
            this.setState({episode: res.data, id: res.data.id}, () => {
                this.reloadPlaylist();
                this.getComments();
            });
        });
    }

    getEpisodeInfo() {
        let url = `episode/${this.props.match.params.id}`;
        console.log("Get Episode Info\nIsLoggedIn: " + this.props.is_logged_in);
        RequestUtilities.sendGetRequest(url, this.props.is_logged_in).then(res => {
            this.setState({episode: res.data}, () => {
                this.reloadPlaylist();
                this.getComments();
            });
            console.log(res.data);
            // console.log("Getting episode info");
        });
    }

    getPlaylist() {
        console.log("Getting playlist");
        return RequestUtilities.sendGetRequest(`playlist/${this.state.episode.id}`, false).then(res => {
            this.setState({playlist: res.data});
            return res.data;
        });
    }

    reloadPlaylist() {
        this.getPlaylist().then(res => {
            // window.jwplayer("player-container").load(res);
        });
    }

    removePlayer = () => {
        if (this.state.has_player) {
            console.log("Video Removed");
            window.jwplayer("player-container").remove();
        }
    };

    getComments = () => {
        RequestUtilities.sendGetRequest(`episode/${this.state.episode.id}/comments`, this.props.is_logged_in).then(res => {
            this.setState({comments: res.data});
        });
    };

    componentDidMount() {
        // this.props.history.listen((event, action) => {
        //     if (action === "POP") {
        //         this.getEpisodeInfo();
        //     }
        // });
    }

    componentWillUnmount() {
        this.removePlayer();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.getEpisode();
        }

        if (prevProps.is_logged_in !== this.props.is_logged_in) {
            this.getComments();
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
                                <div className="video-loading-container">A carregar o video...</div>
                                <ReactJWPlayer playerId={`player-container`} playerScript="https://cdn.jwplayer.com/libraries/7OxfLofq.js" playlist={`${process.env.REACT_APP_API_URL}/playlist/${this.state.id}`}
                                               onReady={
                                                   event => {
                                                       this.setState({has_player: true});
                                                       window.jwplayer().addButton("/images/cortinas_down.svg", "Modo de Downs", function () {
                                                           console.log("Button Clicked");
                                                           document.getElementById("player-container").classList.toggle("theater-mode");
                                                           document.getElementById("app").classList.toggle("overflow-hidden");
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
                                                           // this.getEpisodeInfo();
                                                       }
                                                   }
                                               }
                                               onError={
                                                   event => {
                                                       console.log("Error Loading the Video");
                                                   }
                                               }
                                />
                                <EpisodeOptions episode={this.state.episode} is_logged_in={this.props.is_logged_in} sendLike={this.sendLike} getEpisodeInfo={this.getEpisodeInfo}/>
                                <EpisodeControls anime={this.state.episode.anime} episode={this.state.playlist !== null && this.state.playlist.length >= 2 ? this.state.playlist[1] : this.state.episode}/>
                                <AnimeDetails anime={this.state.episode.anime}/>
                            </div>
                        </div>
                        <div className="episode-list-container">
                            <EpisodeList playlist={this.state.playlist.slice(1)} episode={this.state.episode}/>
                        </div>
                    </div>
                    <CommentSection getComments={this.getComments} episode={this.state.episode} comments={this.state.comments} is_logged_in={this.props.is_logged_in}/>
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