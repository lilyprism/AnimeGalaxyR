import React from 'react';

import "./animelist.sass";
import CardLayout from "../CardLayout";
import RequestUtilities from "../../util/RequestUtilities";

export default class AnimeList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            genres: [],
            search: "",
            ordering: "name",
            genre: "-1",
            count: 0,
            items: [
                {
                    id: -1,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -2,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -3,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -4,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -5,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -6,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -7,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -8,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -9,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -10,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -11,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -12,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -13,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -14,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -15,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -16,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -17,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -18,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -19,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -20,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -21,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -22,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -23,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                }, {
                    id: -24,
                    name: "",
                    description: "",
                    image: "/images/card_placeholder.webp",
                    episodes: "",
                    views: "",
                    genres: []
                },
            ]
        };
        this.getAnime();
        this.getGenres();
    }

    getAnime = () => {
        console.log(`anime/list?ordering=${this.state.ordering}&search=${this.state.search}?page=${this.state.page}${this.state.genre !== "-1" ? `&genres=${this.state.genre}` : ""}`);
        RequestUtilities.sendGetRequest(`anime/list?ordering=${this.state.ordering}&search=${this.state.search}${this.state.genre !== "-1" ? `&genres=${this.state.genre}` : ""}`).then(res => {
            console.log("Fuck this shit im out");
            console.log(res.data);
            this.setState({
                items: res.data.results,
                count: res.data.count
            });
        }).catch(err => {
            console.log(err.response);
        });
    };

    getGenres = () => {
        RequestUtilities.sendGetRequest("anime/genres", false).then(res => {
            this.setState({genres: res.data});
        });
    };

    render() {
        return (
            <div className="anime-list-container">
                <div className="border-bottom-red"/>
                <div className="gradient-container">
                    <div className="breakpoint-container">
                        <h2 className="bg-title">
                            <div className="pless-title">
                                <span>Lista de Animes</span>
                            </div>
                        </h2>
                        <div className="spacer"/>
                        <div className="anime-list-search-area">
                            <input type="text" className="anime-list-search-input" name="animelist-search" aria-label="Anime List search field" placeholder="Eg: Fairy Tail"/>
                            <div className="anime-list-filters">
                                <button className="search-type-toggle-btn">Mudar modo de pesquisa</button>
                                <select name="ordering" aria-label="Anime order" className="anime-list-ordering-select" defaultValue={"name"} onChange={event => {
                                    this.setState({ordering: event.target.value}, () => {
                                        this.getAnime();
                                    });
                                }}>
                                    <option value="name">Ordem Alfabética ↑</option>
                                    <option value="-name">Ordem Alfabética ↓</option>
                                    <option value="-id">Data de Lançamento ↑</option>
                                    <option value="id">Data de Lançamento ↓</option>
                                </select>
                                <select name="genres" aria-label="Genre filter" className="anime-list-genres-select" defaultValue={""} onChange={event => {
                                    this.setState({genre: event.target.value}, () => {
                                        this.getAnime();
                                    });
                                }}>
                                    <option value="-1">Géneros</option>
                                    {this.state.genres.map(function (genre, index) {
                                        return <option value={genre.id} key={genre.id}>{genre.name}</option>;
                                    })}
                                </select>
                            </div>
                            <div className="results-info">
                                Exibindo {this.state.items.length} resultados de {this.state.count} - Página {this.state.page} de {Math.ceil(this.state.count / 24)}
                            </div>
                        </div>
                        <div className="spacer"/>
                        <div className="results-container">
                            <CardLayout type={3} items={this.state.items} xl={4} l={3} md={2} sm={2}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

};