import React from 'react';

import "./animepage.sass";

import RequestUtilities from "./../../util/RequestUtilities";
import ReactDOM from "react-dom";

export default class AnimePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            anime: {
                name: "Fairy Tail",
                description: "Ola",
                image: "http://via.placeholder.com/250x350",
                thumbnail: "http://via.placeholder.com/1920x1080",
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
            mouseOverRating: 0,
            ratingInterval: 100 / 10 // 100 / <Number of intervals you want>
        };
        // this.getAnimeDetails();
    }

    getAnimeDetails = () => {
        RequestUtilities.sendGetRequest(`anime/${this.props.match.params.id}`, false).then(res => {
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

    handleMouseMoveRating = event => {
        let boundingRect = event.currentTarget.getBoundingClientRect();
        let relativeX = event.clientX - boundingRect.left;
        let relativePercentage = Math.round(Math.round(relativeX / (event.currentTarget.scrollWidth - 1) * 100 / this.state.ratingInterval) * this.state.ratingInterval);
        this.setState({mouseOverRating: relativePercentage});
    };

    handleMouseEnterRating = event => {
        this.setState({ratingMode: 1});
    };

    handleMouseLeaveRating = event => {
        this.setState({ratingMode: 0});
    };

    render() {
        if (this.state.anime !== null) {
            let description = this.state.anime.description;

            let stars_html = [];
            for (let i = 0; i < 5; i++) {
                stars_html.push(
                    <i className="fas fa-star star" key={i}/>
                );
            }

            return (
                <div className="anime-page">
                    <div className="trailer-container">
                        <div className="trailer-container-overlay" onClick={this.handleThumbnailOverlayClick}/>
                        <div className="trailer">
                            <iframe id="trailer-player" src={``} frameBorder="0" autoPlay/>
                        </div>
                    </div>

                    <div className="gradient-container">
                        <div className="breakpoint-container">
                            <div className="spacer"/>
                            <div className="anime-details">
                                <div className="anime-thumbnail" style={{backgroundImage: `url(${this.state.anime.thumbnail})`}}>
                                    <div className="breadcrumbs">
                                        <p>Home <i className="fas fa-chevron-right"/> Anime <i className="fas fa-chevron-right"/> {this.state.anime.name}</p>
                                    </div>
                                    <div className="thumbnail-play-btn" onClick={this.handleThumbnailPlayClick}>
                                        <i className="fas fa-play"/>
                                    </div>
                                </div>
                                <div className="anime-details">
                                    <div className="anime-details-left">
                                        <div className="anime-image-description">
                                            <div className="anime-image-container">
                                                <img className="anime-image" src={this.state.anime.image} alt="Anime Image"/>
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
                                            <p className="rating-vote-number">(Based on 300 votes)</p>
                                            <div className="rating-container">
                                                <div className="rating" style={{backgroundImage: `linear-gradient(to right, gold 0 ${this.state.ratingMode === 1 ? this.state.mouseOverRating : this.state.anime.rating}%, gray ${this.state.ratingMode === 1 ? this.state.mouseOverRating : this.state.anime.rating}% 100%)`}} title={this.state.ratingMode === 1 ? this.state.mouseOverRating : this.state.anime.rating} onMouseEnter={this.handleMouseEnterRating} onMouseMove={this.handleMouseMoveRating} onMouseLeave={this.handleMouseLeaveRating}>
                                                    {stars_html}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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