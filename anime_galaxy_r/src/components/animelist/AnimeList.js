import React from 'react';

import "./animelist.sass";
import CardLayout from "../CardLayout";
import RequestUtilities from "../../util/RequestUtilities";
import * as ReactDOM from "react-dom";

export default class AnimeList extends React.Component {

    search_chars = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            genres: [],
            search: "",
            ordering: "name",
            genre: "-1",
            count: 24,
            previous: null,
            next: null,
            searchMode: 1,
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
        console.log(`anime/list?ordering=${this.state.ordering}&search=${this.state.search}&page=${this.state.page}${this.state.genre !== "-1" ? `&genres=${this.state.genre}` : ""}`);
        RequestUtilities.sendGetRequest(`anime/list?ordering=${this.state.ordering}&search=${this.state.search}&page=${this.state.page}${this.state.genre !== "-1" ? `&genres=${this.state.genre}` : ""}`).then(res => {
            console.log("Fuck this shit im out");
            console.log(res.data);
            this.setState({
                items: res.data.results,
                count: res.data.count,
                previous: res.data.previous,
                next: res.data.next
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

    toggleSearchMode = () => {
        this.setState({search: "", searchMode: -this.state.searchMode}, () => {
            this.getAnime();
        });
    };

    handleCharClick(event, char) {
        let this_el = ReactDOM.findDOMNode(this);
        if (this_el instanceof HTMLElement) {
            let previousChar = this_el.querySelector(".anime-char-list-item.active");
            if (previousChar != null) {
                previousChar.classList.remove("active");
            }
        }
        event.target.classList.add("active");

        this.setState({search: char}, () => {
            this.getAnime();
        });
    }

    setPage = page => {
        this.setState({page: page}, () => {
            this.getAnime();
        });
    };

    nextPage = () => {
        let next_page = this.state.page + 1;
        this.setState({page: next_page}, () => {
            this.getAnime();
        });
    };

    previousPage = () => {
        let previous_page = this.state.page - 1;
        this.setState({page: previous_page}, () => {
            this.getAnime();
        });
    };

    render() {
        let max_pages = Math.ceil(this.state.count / 24);

        let page_controls = [];
        for (let i = Math.max(1, this.state.page - 2); i < this.state.page; i++) {
            page_controls.push(<div className="pagination-control" tabIndex={0} key={i} onClick={event => this.setPage(i)}>{i}</div>);
        }
        page_controls.push(<div className="pagination-control current-page" tabIndex={0} key={this.state.page}>{this.state.page}</div>);
        for (let i = 0; i < Math.min(2, max_pages - this.state.page); i++) {
            page_controls.push(<div className="pagination-control" tabIndex={0} key={this.state.page + i + 1} onClick={event => this.setPage(this.state.page + i + 1)}>{this.state.page + i + 1}</div>);
        }

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
                            {
                                this.state.searchMode === 1 ?
                                    <input type="text" className="anime-list-search-input" name="animelist-search" aria-label="Anime List search field" placeholder="Eg: Fairy Tail"
                                           onChange={
                                               event => {
                                                   this.setState({search: event.target.value}, () => this.getAnime());
                                               }
                                           }
                                    />
                                    :
                                    <ul className="anime-char-list">
                                        {
                                            this.search_chars.map((char, index) => {
                                                return (
                                                    <li className="anime-char-list-item" onClick={event => this.handleCharClick(event, encodeURIComponent(char))} key={index}>
                                                        {char}
                                                    </li>
                                                );
                                            })
                                        }
                                    </ul>
                            }
                            <div className="anime-list-filters">
                                <button className="search-type-toggle-btn" onClick={this.toggleSearchMode}>Mudar modo de pesquisa</button>
                                <select name="ordering" aria-label="Anime order" className="anime-list-ordering-select fas" defaultValue={"name"} onChange={event => {
                                    this.setState({ordering: event.target.value}, () => {
                                        this.getAnime();
                                    });
                                }}>
                                    <option value="name">Ordem Alfabética &nbsp;&#xf0d8;</option>
                                    <option value="-name">Ordem Alfabética &nbsp;&#xf0d7;</option>
                                    <option value="-id">Data de Lançamento &nbsp;&#xf0d8;</option>
                                    <option value="id">Data de Lançamento &nbsp;&#xf0d7;</option>
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
                                Exibindo {this.state.items.length} resultados de {this.state.count} - Página {this.state.page} de {max_pages}
                            </div>
                        </div>
                        <div className="spacer"/>
                        <div className="results-container">
                            <CardLayout type={3} items={this.state.items} xl={4} l={3} md={2} sm={2}/>
                            <div className="spacer"/>
                            {
                                max_pages > 1 ?
                                    <div className="pagination-controls">
                                        {this.state.page > 1 ? <div className="pagination-control previous-page-control" onClick={() => this.setPage(1)} tabIndex={0}><i className="fas fa-backward fa-fw"/></div> : <div className="pagination-control previous-page-control disabled"><i className="fas fa-backward fa-fw"/></div>}
                                        {this.state.previous !== null && this.state.previous !== undefined ? <div className="pagination-control previous-page-control" tabIndex={0} onClick={this.previousPage}><i className="fas fa-caret-left fa-fw"/></div> : <div className="pagination-control previous-page-control pagination-control-disabled"><i className="fas fa-caret-left fa-fw"/></div>}
                                        {page_controls}
                                        {this.state.next !== null && this.state.next !== undefined ? <div className="pagination-control next-page-control" tabIndex={0} onClick={this.nextPage}><i className="fas fa-caret-right fa-fw"/></div> : <div className="pagination-control next-page-control pagination-control-disabled"><i className="fas fa-caret-right fa-fw"/></div>}
                                        {this.state.page < max_pages ? <div className="pagination-control previous-page-control" tabIndex={0} onClick={() => this.setPage(max_pages)}><i className="fas fa-forward fa-fw"/></div> : <div className="pagination-control previous-page-control disabled"><i className="fas fa-forward fa-fw"/></div>}
                                    </div>
                                    :
                                    ""
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

};