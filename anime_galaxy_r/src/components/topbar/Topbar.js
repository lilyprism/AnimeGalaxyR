import React from 'react';
import {Link} from "react-router-dom";
import * as ReactDOM from "react-dom";

import './topbar.sass';

import App from "./../App";
import SearchResultBox from "./SearchResultBox";

export default class Topbar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            results_open: false,
            search_results: []
        }
    }

    toggleSidebar = () => {
        let sidebar_el = document.querySelector(".sidebar");
        let content_el = document.querySelector(".content-wrapper");

        sidebar_el.classList.toggle("open");
        content_el.classList.toggle("dimmed");

        let sidebar_items = document.querySelectorAll(".sidebar a");

        if (sidebar_items[0].tabIndex === -1) {
            for (let i = 0; i < sidebar_items.length; i++) {
                sidebar_items[i].tabIndex = "2";
            }
        } else {
            for (let i = 0; i < sidebar_items.length; i++) {
                sidebar_items[i].tabIndex = "-1";
            }
        }
    };

    toggleSearchBar = value => {
        let this_el = ReactDOM.findDOMNode(this);

        if (this_el instanceof HTMLElement) {
            if (value === undefined) {
                if (this.state.results_open) {
                    this.toggleSearchResults("hide");
                    console.log("Toggle with results open");
                    setTimeout(function () {
                        this_el.querySelector(".search-area").classList.toggle("open");
                    }, 500);
                } else {
                    this.toggleSearchResults("hide");
                    this_el.querySelector(".search-area").classList.toggle("open");
                }
            } else if (value === "hide") {
                if (this.state.results_open) {
                    this.toggleSearchResults("hide");
                    console.log("Hide searchbar with results open");
                    setTimeout(function () {
                        this_el.querySelector(".search-area").classList.remove("open");
                    }, 500);
                } else {
                    console.log(this.state.results_open);
                    this.toggleSearchResults("hide");
                    this_el.querySelector(".search-area").classList.remove("open");
                }
            } else if (value === "show") {
                this.toggleSearchResults("hide");
                this_el.querySelector(".search-area").classList.add("open");
            }
        }
    };

    toggleSearchResults = value => {
        let this_el = ReactDOM.findDOMNode(this);

        if (this_el instanceof HTMLElement) {
            let search_result_box = this_el.querySelector(".search-result-box");
            if (value === undefined) {
                this.setState({results_open: !this.state.results_open});
                search_result_box.classList.toggle("open");
            } else if (value === "hide") {
                this.setState({results_open: false});
                search_result_box.classList.remove("open");
                search_result_box.style.height = "0";
            } else if (value === "show") {
                this.setState({results_open: true});
                search_result_box.classList.add("open");
                search_result_box.style.height = `${search_result_box.scrollHeight}px`;
            }
        }
    };

    searchAnime = search_term => {
        if (search_term.length >= 1) {
            this.toggleSearchResults("show");
            App.sendGetRequest(`anime/search?text=${search_term}`, false).then(res => {
                console.log(res);
                this.setState({search_results: res.data}, () => {
                    this.toggleSearchResults("show");
                });
                console.log(res.data);
            }).catch(err => {
                // this.toggleSearchResults("hide");
            });
        }
    };

    componentDidMount() {
        let this_el = ReactDOM.findDOMNode(this);

        if (this_el instanceof HTMLElement) {
            let search_input_container = this_el.querySelector(".search-input-container");
            let search_icon = this_el.querySelector(".search-icon");

            document.body.addEventListener("click", event => {
                if (!search_input_container.contains(event.target) && !search_icon.contains(event.target)) {
                    this.toggleSearchBar("hide");
                }
            });
        }
    }

    render() {
        return (
            <nav className="topbar">
                <div className="topbar-container breakpoint-container">
                    <div className="logo-burger-container">
                        <i className="fas fa-bars fa-17x icon" role="button" onClick={this.toggleSidebar} tabIndex="1"/>
                        <Link to="/" tabIndex="3"
                              onClick={
                                  event => {
                                      App.hideSidebar();
                                      App.loseFocus();
                                  }
                              }>
                            <img className="logo" src="/images/logo.png" alt="Logo" height="50"/>
                        </Link>
                    </div>
                    <div className="search-area">
                        <div className="search-input-container">
                            <input className="search-input" id="search-input" placeholder="eg: Fairy Tail" spellCheck={false} type="text"
                                   onChange={
                                       event => {
                                           this.searchAnime(event.target.value)
                                       }
                                   }
                            />
                            <div className="search-result-box-container">
                                <SearchResultBox results={this.state.search_results} results_open={this.state.results_open}/>
                            </div>
                        </div>
                        <div className="icon search-icon" role="button" onClick={event => this.toggleSearchBar()}>
                            <i className="fas fa-search fa-17x"/>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

};