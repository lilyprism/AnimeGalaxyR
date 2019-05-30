import React from 'react';

import "./episodepage.sass";

import axios from 'axios';
import ReactJWPlayer from 'react-jw-player';

export default class EpisodePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            episode: null
        };
        this.getEpisode();
    }

    getEpisode() {
        axios.get(`${process.env.REACT_APP_API_URL}/videos/${this.props.match.params.id}`).then(res => {
            this.setState({episode: res.data, id: res.data.id});
        }).catch(res => {
            setTimeout(() => this.getEpisode(), 2000);
        });
    }

    getEpisodeInfo(){
        axios.get(`${process.env.REACT_APP_API_URL}/videos/${this.props.match.params.id}`).then(res => {
            this.setState({episode: res.data});
        }).catch(res => {
            setTimeout(() => this.getEpisodeInfo(), 2000);
        });
    }

    render() {
        if (this.state.episode !== null) {
            return (
                <div>
                    <div className="spacer"/>
                    <div className="episode-page-player">
                        <ReactJWPlayer playerId="player-container" playerScript="https://cdn.jwplayer.com/libraries/7OxfLofq.js" playlist={`${process.env.REACT_APP_API_URL}/playlist/${this.state.id}`}
                                       onVideoLoad={
                                           event => {
                                               console.log(event);
                                               console.log(event.item.id);
                                               console.log(this.props.match.params.id);
                                               if (event.item.id !== this.props.match.params.id) {
                                                   console.log("Pushed history");
                                                   console.log(event.item.id);
                                                   this.props.history.push(`/v/${event.item.id}`);
                                                   this.getEpisodeInfo();
                                               }
                                           }
                                       }
                                       onError={
                                           event => {
                                               if (event.code === 224003) {
                                                   console.log(event);
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
                    </div>
                    <h1 className="title"><span>{this.state.episode.anime.name} - Episode {this.state.episode.number}</span></h1>
                </div>
            );
        } else {
            return (
                <div>
                    Wait a second
                </div>
            );
        }
    }

}