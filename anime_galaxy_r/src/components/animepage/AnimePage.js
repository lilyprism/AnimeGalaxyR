import React from 'react';

import "./animepage.sass";

import RequestUtilities from "./../../util/RequestUtilities";
import ReactDOM from "react-dom";
import Rating from "../rating/Rating";
import App from "../App";
import CardLayout from "../cardlayout/CardLayout";
import {Link} from "react-router-dom";

export default class AnimePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            anime: {
                name: "Fairy Tail",
                description: "Ola",
                image: "http://via.placeholder.com/255x360",
                thumbnail: "http://via.placeholder.com/1920x1080",
                seasons: [
                    {
                        number: 1,
                        name: "Season 1"
                    }, {
                        number: 2,
                        name: "Season 2"
                    }, {
                        number: 3,
                        name: "Season 3"
                    }, {
                        number: 4,
                        name: "Season 4"
                    }
                ],
                genres: [
                    {
                        name: "Ação",
                    }, {
                        name: "Aventura",
                    }, {
                        name: "Magia",
                    }, {
                        name: "Isekai",
                    }, {
                        name: "Shounen",
                    }
                ],
                rating: 48,
                trailer: ""
            },
            episodes: [
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
                }
            ],
            current_season: 0,
            current_page: 1
        };
        this.getAnimeDetails();
    }

    getAnimeDetails = () => {
        RequestUtilities.sendGetRequest(`anime/${this.props.match.params.id}`, App.isLoggedIn()).then(res => {
            this.setState({anime: res.data});
            console.log(res.data);
        });
    };

    handleThumbnailPlayClick = () => {
        let this_el = ReactDOM.findDOMNode(this);

        if (this_el instanceof HTMLElement) {
            this_el.querySelector(".trailer-container").classList.add("show");
            this_el.querySelector("#trailer-player").setAttribute("src", `${this.state.anime.trailer}?autoplay=1&showinfo=0&rel=0&playsinline=1`);
        }
    };

    handleThumbnailOverlayClick = () => {
        let this_el = ReactDOM.findDOMNode(this);

        if (this_el instanceof HTMLElement) {
            this_el.querySelector(".trailer-container").classList.remove("show");
            this_el.querySelector("#trailer-player").setAttribute("src", "");
        }
    };

    sendVote = rating => {
        if (this.props.is_logged_in) {
            RequestUtilities.sendPostRequest(`anime/${this.state.anime.id}/vote`, {rating: rating}, true).then(res => {
                console.log(res.data);
                let animeRating = {...this.state.anime.rating};
                let anime = {...this.state.anime};

                if (anime.user_rating != null) {
                    animeRating.number -= anime.user_rating / animeRating.votes;
                } else {
                    animeRating.votes += 1;
                }
                animeRating.number = animeRating.number + rating / animeRating.votes;

                anime.rating = animeRating;
                anime.user_rating = rating;
                this.setState({anime: anime});
            }).catch(err => {
                console.log(err.response);
            });
        }
    };

    render() {
        if (this.state.anime !== null) {
            let description = this.state.anime.description;

            return (
                <div className="anime-page">
                    <div className="trailer-container">
                        <div className="trailer-container-overlay" onClick={this.handleThumbnailOverlayClick}/>
                        <div className="trailer">
                            <iframe id="trailer-player" src={``} title="Anime Trailer" frameBorder="0" autoPlay/>
                        </div>
                    </div>

                    <div className="gradient-container">
                        <div className="breakpoint-container">
                            <div className="spacer"/>
                            <div className="anime-details-thumbnail">
                                <div className="anime-thumbnail" style={{backgroundImage: `url(${this.state.anime.thumbnail})`}}>
                                    <div className="breadcrumbs">
                                        <p><Link to={"/"}>Home</Link> > <Link to={"/anime"}>Anime</Link> > {this.state.anime.name}</p>
                                    </div>
                                    <div className="thumbnail-play-btn" onClick={this.handleThumbnailPlayClick}>
                                        <i className="fas fa-play"/>
                                    </div>
                                </div>
                                <div className="anime-details">
                                    <div className="anime-details-left">
                                        <div className="anime-image-description">
                                            <div className="anime-image-container">
                                                <img className="anime-image" src={this.state.anime.image} alt="Anime"/>
                                            </div>
                                            <div className="anime-description-title">
                                                <h2 className="anime-title">
                                                    {this.state.anime.name}
                                                </h2>
                                                <div className="anime-description" dangerouslySetInnerHTML={{__html: description}}/>
                                            </div>
                                        </div>
                                        <div className="genres-container">
                                            {this.state.anime.genres.map(function (genre, index) {
                                                return <span className="genre" key={index}>{genre.name}</span>
                                            })}
                                        </div>
                                    </div>
                                    <div className="anime-details-right">
                                        <div className="anime-details-rating">
                                            <p className="font-size-20px text-center rating-title">Rating</p>
                                            <p className="rating-vote-number">(Based on {this.state.anime.rating.votes} votes)</p>
                                            <div className="rating-container">
                                                <Rating readOnly={!this.props.is_logged_in} rating={this.state.anime.rating.number} newRating={this.state.anime.user_rating} intervals={10} stars={5} onClick={this.sendVote}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="spacer"/>
                        </div>
                    </div>
                    <div className="border-bottom-red"/>
                    <div className="gradient-container">
                        <div className="breakpoint-container">
                            <h2 className="bg-title">
                                <div className="pless-title">
                                    <span>Lista de Episódios</span>
                                </div>
                            </h2>
                            <div className="spacer"/>
                            <div className="seasons">
                                {this.state.anime.seasons.map((season, index) => {
                                    return (
                                        <div className={`season${index === this.state.current_season ? " active" : ""}`}>
                                            <span className="season-name">{season.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="spacer"/>
                            <div className="anime-episodes-container">
                                <CardLayout items={this.state.episodes} type={5} xl={4} l={4} md={2} sm={2} is_logged_in={this.props.is_logged_in} animate={false}/>
                            </div>
                            <div className="spacer"/>
                        </div>
                    </div>
                </div>
            );
        } else {
            return "";
        }
    }

};