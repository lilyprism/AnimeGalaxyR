import React from 'react';

import CardLayout from "../CardLayout";
import {Carousel} from "./Carousel";
import App from "../App";

export default class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            latest_episodes: [],
            latest_anime: [

            ],
            watched_anime: []
        };
        // this.getLatestEpisodes();
        // console.log("Constructor");
    }

    getLatestEpisodes() {
        // console.log(`${process.env.REACT_APP_API_URL}/episodes`);
        App.sendGetRequest("episode/latest", false).then(res => {
            this.setState({
                latest_episodes: res.data
            });
        }).catch(res => {
            console.log("Error getting the episode");
            setTimeout(() => this.getLatestEpisodes(), 5000);
        });
    }

    getLatestAnime() {
        App.sendGetRequest("anime/latest", false).then(res => {
            this.setState({
                latest_anime: res.data
            });
        }).catch(res => {
            console.log("Error getting the episode");
            setTimeout(() => this.getLatestAnime(), 5000);
        });
    }

    getWatchedAnime() {
        App.sendGetRequest("anime/watched", true).then(res => {
            this.setState({
                watched_anime: res.data
            });
        }).catch(res => {
            console.log("Error getting the episode");
            setTimeout(() => this.getWatchedAnime(), 5000);
        });
    }

    componentDidMount() {
        this.getLatestEpisodes();
        this.getLatestAnime();
        this.getWatchedAnime();
    }

    render() {
        return (
            <div>
                <h1 className="title"><span><i className="fas fa-newspaper"/>  Episódios:</span></h1>
                <CardLayout card_type={"LatestEpisodeCard"} items={this.state.latest_episodes}/>
                <h1 className="title"><span><i className="fas fa-newspaper"/>  Últimos Animes:</span></h1>
                <Carousel item_type="CarouselItem" items={this.state.latest_anime}/>
                <h1 className="title"><span><i className="fas fa-newspaper"/>  Assistidos No Momento:</span></h1>
                <Carousel item_type="CarouselItemEpisode" items={this.state.watched_anime}/>
            </div>
        );
    }

};