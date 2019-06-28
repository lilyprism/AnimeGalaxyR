import React from 'react';

import "./home.sass";

import RequestUtilities from "./../../util/RequestUtilities";
import Carousel from "./Carousel";
import CardLayout from "./../CardLayout";

export default class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            latest_episodes: [],
            latest_anime: [],
            watched_anime: []
        };
        this.getLatestEpisodes();
        // this.getLatestAnime();
        this.getWatchedAnime();
    }

    getLatestEpisodes() {
        // console.log(`${process.env.REACT_APP_API_URL}/episodes`);
        RequestUtilities.sendGetRequest("episode/latest", this.props.is_logged_in).then(res => {
            this.setState({
                latest_episodes: res.data
            });
            console.log(res.data);
        }).catch(res => {
            console.log("Error getting the latest episodes");
            setTimeout(() => this.getLatestEpisodes(), 5000);
        });
    }

    getMoreLatestEpisodes = () => {
        if (this.state.latest_episodes.next !== null) {
            let startIndex = this.state.latest_episodes.next.indexOf("api/") + 4;
            let endpoint = this.state.latest_episodes.next.substring(startIndex);

            RequestUtilities.sendGetRequest(endpoint, this.props.is_logged_in).then(res => {
                res.data.results = this.state.latest_episodes.results.concat(res.data.results);
                this.setState({
                    latest_episodes: res.data
                });
            }).catch(res => {
                console.log("Error getting the latest episodes");
                setTimeout(() => this.getLatestEpisodes(), 5000);
            });
        }
    };

    getLatestAnime() {
        RequestUtilities.sendGetRequest("anime/latest", false).then(res => {
            this.setState({
                latest_anime: res.data
            });
        }).catch(res => {
            console.log("Error getting the latest anime");
            setTimeout(() => this.getLatestAnime(), 5000);
        });
    }

    getWatchedAnime() {
        RequestUtilities.sendGetRequest("anime/watched", true).then(res => {
            this.setState({
                watched_anime: res.data
            });
            console.log(res.data);
        }).catch(res => {
            console.log("Error getting the watched anime");
            setTimeout(() => this.getWatchedAnime(), 5000);
        });
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.is_logged_in !== this.props.is_logged_in) {
            this.getLatestEpisodes();
        }
    }

    render() {
        let latest_episodes_cards = [];
        if (this.state.latest_episodes.results !== undefined) {
            for (let i = 0; i < parseInt(Math.ceil(this.state.latest_episodes.results.length / 8)); i++) {
                latest_episodes_cards.push(
                    <CardLayout items={this.state.latest_episodes.results !== undefined ? this.state.latest_episodes.results.slice(i * 8, (i + 1) * 8) : []} type={1} xl={4} l={4} md={2} sm={2} is_logged_in={this.props.is_logged_in}/>
                );
            }
        }

        return (
            <div>
                <div className={`home-carousel ${this.state.watched_anime.length === 0 ? "hidden" : ""}`}>
                    <Carousel items={this.state.watched_anime} cycle={this.state.watched_anime.length > 0}/>
                </div>
                <div className="border-bottom-red"/>
                <div className="gradient-container">
                    <div className="breakpoint-container">
                        <h2 className="bg-title">
                            <div className="pless-title">
                                <span>Últimos Episódios</span>
                            </div>
                        </h2>
                        <div className="spacer"/>
                        {latest_episodes_cards}
                        {/*<CardLayout key={0} items={this.state.latest_episodes !== undefined ? this.state.latest_episodes.results : []} type={1} xl={4} l={4} md={2} sm={2} is_logged_in={this.props.is_logged_in}/>*/}
                        {
                            this.state.latest_episodes.next !== null ?
                                <div className="text-center">
                                    <button className="bordered-btn" onClick={this.getMoreLatestEpisodes}>Ver mais</button>
                                </div>
                                :
                                ""
                        }
                        <div className="spacer"/>
                    </div>
                </div>
                <div className="border-bottom-red"/>
                <div className="gradient-container">
                    <div className="breakpoint-container">
                        <h2 className="bg-title">
                            <div className="pless-title">
                                <span>Últimos Animes</span>
                            </div>
                        </h2>
                        <div className="spacer"/>
                        <div className="spacer"/>
                        <div className="spacer"/>
                        <div className="spacer"/>
                        <div className="text-center">
                            <button className="bordered-btn">Ver mais</button>
                        </div>
                        <div className="spacer"/>
                    </div>
                </div>
            </div>
        );
    }

};