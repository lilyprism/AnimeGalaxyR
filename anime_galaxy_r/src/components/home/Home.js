import React from 'react';

import "./home.sass";

import RequestUtilities from "./../../util/RequestUtilities";
import Carousel from "./Carousel";
import CardLayout from "./../CardLayout";

export default class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            latest_episodes: {
                results: [
                    {
                        id: -1,
                        added: "2019-07-02T09:29:53.310375+01:00",
                        favorite: false,
                        number: "",
                        watch_later: false,
                        season: {
                            number: "",
                            anime: {
                                id: 1,
                                image: "/images/card_placeholder.webp",
                                name: ""
                            }
                        }
                    }, {
                        id: -2,
                        added: "2019-07-02T09:29:53.310375+01:00",
                        favorite: false,
                        number: "",
                        watch_later: false,
                        season: {
                            number: "",
                            anime: {
                                id: 1,
                                image: "/images/card_placeholder.webp",
                                name: ""
                            }
                        }
                    }, {
                        id: -3,
                        added: "2019-07-02T09:29:53.310375+01:00",
                        favorite: false,
                        number: "",
                        watch_later: false,
                        season: {
                            number: "",
                            anime: {
                                id: 1,
                                image: "/images/card_placeholder.webp",
                                name: ""
                            }
                        }
                    }, {
                        id: -4,
                        added: "2019-07-02T09:29:53.310375+01:00",
                        favorite: false,
                        number: "",
                        watch_later: false,
                        season: {
                            number: "",
                            anime: {
                                id: 1,
                                image: "/images/card_placeholder.webp",
                                name: ""
                            }
                        }
                    }, {
                        id: -5,
                        added: "2019-07-02T09:29:53.310375+01:00",
                        favorite: false,
                        number: "",
                        watch_later: false,
                        season: {
                            number: "",
                            anime: {
                                id: 1,
                                image: "/images/card_placeholder.webp",
                                name: ""
                            }
                        }
                    }, {
                        id: -6,
                        added: "2019-07-02T09:29:53.310375+01:00",
                        favorite: false,
                        number: "",
                        watch_later: false,
                        season: {
                            number: "",
                            anime: {
                                id: 1,
                                image: "/images/card_placeholder.webp",
                                name: ""
                            }
                        }
                    }, {
                        id: -7,
                        added: "2019-07-02T09:29:53.310375+01:00",
                        favorite: false,
                        number: "",
                        watch_later: false,
                        season: {
                            number: "",
                            anime: {
                                id: 1,
                                image: "/images/card_placeholder.webp",
                                name: ""
                            }
                        }
                    }, {
                        id: -8,
                        added: "2019-07-02T09:29:53.310375+01:00",
                        favorite: false,
                        number: "",
                        watch_later: false,
                        season: {
                            number: "",
                            anime: {
                                id: -1,
                                image: "/images/card_placeholder.webp",
                                name: ""
                            }
                        }
                    },
                ]
            },
            latest_anime: [
                {
                    id: -1,
                    description: "",
                    genres: [],
                    name: "Anime Name Here",
                    views: 0,
                    image: "/images/card_placeholder.webp"
                }, {
                    id: -2,
                    description: " ",
                    genres: [],
                    name: "Anime Name Here",
                    views: 0,
                    image: "/images/card_placeholder.webp"
                }, {
                    id: -3,
                    description: "",
                    genres: [],
                    name: "Anime Name Here",
                    views: 0,
                    image: "/images/card_placeholder.webp"
                }, {
                    id: -4,
                    description: "",
                    genres: [],
                    name: "Anime Name Here",
                    views: 0,
                    image: "/images/card_placeholder.webp"
                }, {
                    id: -5,
                    description: "",
                    genres: [],
                    name: "Anime Name Here",
                    views: 0,
                    image: "/images/card_placeholder.webp"
                }, {
                    id: -6,
                    description: "",
                    genres: [],
                    name: "Anime Name Here",
                    views: 0,
                    image: "/images/card_placeholder.webp"
                }, {
                    id: -7,
                    description: "",
                    genres: [],
                    name: "Anime Name Here",
                    views: 0,
                    image: "/images/card_placeholder.webp"
                }, {
                    id: -8,
                    description: "",
                    genres: [],
                    name: "Anime Name Here",
                    views: 0,
                    image: "/images/card_placeholder.webp"
                }
            ],
            watched_anime: []
        };
        this.getLatestEpisodes();
        this.getLatestAnime();
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
        if (this.state.latest_episodes.next !== null && this.state.latest_episodes.next !== undefined) {
            let startIndex = this.state.latest_episodes.next.indexOf("api/") + 4;
            let endpoint = this.state.latest_episodes.next.substring(startIndex);

            RequestUtilities.sendGetRequest(endpoint, this.props.is_logged_in).then(res => {
                res.data.results = this.state.latest_episodes.results.concat(res.data.results);
                this.setState({
                    latest_episodes: res.data
                });
            }).catch(res => {
                console.log("Error getting more latest episodes");
                setTimeout(() => this.getLatestEpisodes(), 5000);
            });
        }
    };

    getLatestAnime() {
        RequestUtilities.sendGetRequest("anime/latest", false).then(res => {
            this.setState({
                latest_anime: res.data
            });
            console.log(res.data);
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
                    <CardLayout items={this.state.latest_episodes.results !== undefined ? this.state.latest_episodes.results.slice(i * 8, (i + 1) * 8) : []} type={1} xl={4} l={4} md={2} sm={2} is_logged_in={this.props.is_logged_in} animate={i !== 0} key={this.state.latest_episodes.results[i * 8].id}/>
                );
            }
        }

        return (
            <div>
                <div className={`home-carousel`}>
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
                        <div className="latest-episodes-container">
                            {latest_episodes_cards}
                        </div>
                        {
                            this.state.latest_episodes.next !== null ?
                                <div className="text-center">
                                    <div className="spacer"/>
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
                        <div className="latest-anime-container">
                            <CardLayout key={0} items={this.state.latest_anime !== undefined ? this.state.latest_anime : []} type={2} xl={4} l={4} md={2} sm={2} is_logged_in={this.props.is_logged_in} animate={false}/>
                        </div>
                        <div className="text-center">
                            <div className="spacer"/>
                            <button className="bordered-btn">Ver Todos</button>
                        </div>
                        <div className="spacer"/>
                    </div>
                </div>
            </div>
        );
    }

};