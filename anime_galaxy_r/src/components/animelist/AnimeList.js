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
            ordering: "",
            genre: "",
            count: 0,
            items: [
                {
                    id: 1,
                    name: "Fairy Tail",
                    description: "<This is a description>",
                    image: "http://via.placeholder.com/400x700",
                    episodes: 450,
                    views: 199212,
                    genres: [
                        {
                            name: "Ação",
                        },{
                            name: "Magia"
                        }
                    ]
                },{
                    id: 2,
                    name: "Fairy Tail",
                    description: "<This is a description>",
                    image: "http://via.placeholder.com/400x700",
                    episodes: 450,
                    views: 199212,
                    genres: [
                        {
                            name: "Ação",
                        },{
                            name: "Magia"
                        }
                    ]
                },{
                    id: 3,
                    name: "Fairy Tail",
                    description: "<This is a description>",
                    image: "http://via.placeholder.com/400x700",
                    episodes: 450,
                    views: 199212,
                    genres: [
                        {
                            name: "Ação",
                        },{
                            name: "Magia"
                        }
                    ]
                },{
                    id: 4,
                    name: "Fairy Tail",
                    description: "<This is a description>",
                    image: "http://via.placeholder.com/400x700",
                    episodes: 450,
                    views: 199212,
                    genres: [
                        {
                            name: "Ação",
                        },{
                            name: "Magia"
                        }
                    ]
                },{
                    id: 5,
                    name: "Fairy Tail",
                    description: "<This is a description>",
                    image: "http://via.placeholder.com/400x700",
                    episodes: 450,
                    views: 199212,
                    genres: [
                        {
                            name: "Ação",
                        },{
                            name: "Magia"
                        }
                    ]
                },
            ]
        };
        this.getAnime();
    }

    getAnime = () => {
        console.log(`anime/list?ordering=${this.state.ordering}&search=${this.state.search}?page=${this.state.page}${this.state.genre !== "" ? `&genre=${this.state.genre}` : ""}`);
        RequestUtilities.sendGetRequest(`anime/list?ordering=${this.state.ordering}&search=${this.state.search}${this.state.genre !== "" ? `&genre=${this.state.genre}` : ""}`).then(res => {
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
                            <input type="text" className="anime-list-search-input" placeholder="Eg: Fairy Tail"/>
                            <div className="anime-list-filters">
                                <button className="search-type-toggle-btn">Mudar modo de pesquisa</button>
                                <select name="ordering" className="anime-list-ordering-select" defaultValue={"name"} onChange={event => this.setState({ordering: event.target.value})}>
                                    <option value="name">Ordem Alfabética</option>
                                    <option value="id">Data de Lançamento</option>
                                </select>
                                <select name="genres" className="anime-list-genres-select" defaultValue={""} onChange={event => this.setState({genre: event.target.value})}>
                                    <option value="">Géneros</option>
                                    <option value="Ação">Ação</option>
                                    <option value="Aventura">Aventura</option>
                                    <option value="Isekai">Isekai</option>
                                    <option value="Yuri">Yuri</option>
                                    <option value="Sports">Sports</option>
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