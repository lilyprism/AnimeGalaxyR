import React from 'react';
import {Link} from "react-router-dom";
import * as ReactDOM from "react-dom";

import './topbar.sass';

import SearchResultBox from "./SearchResultBox";
import RequestUtilities from "../../util/RequestUtilities";
import App from "../App";

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
                    setTimeout(function () {
                        this_el.querySelector(".search-area").classList.toggle("open");
                    }, 300);
                } else {
                    this.toggleSearchResults("hide");
                    this_el.querySelector(".search-area").classList.toggle("open");
                }
            } else if (value === "hide") {
                if (this.state.results_open) {
                    this.toggleSearchResults("hide");
                    setTimeout(function () {
                        this_el.querySelector(".search-area").classList.remove("open");
                    }, 300);
                } else {
                    this.toggleSearchResults("hide");
                    this_el.querySelector(".search-area").classList.remove("open");
                }
            } else if (value === "show") {
                this.toggleSearchResults("hide");
                this_el.querySelector(".search-area").classList.add("open");
            }

            if (this_el.querySelector(".search-area").classList.contains("open")) {
                let search_input = this_el.querySelector(".search-input");
                search_input.focus();
                search_input.tabIndex = 0;
            } else {
                let search_input = this_el.querySelector(".search-input");
                search_input.tabIndex = -1;
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
            } else if (value === "show") {
                this.setState({results_open: true});
                search_result_box.classList.add("open");
            }
        }
    };

    toggleUserDropdown = () => {
        let this_el = ReactDOM.findDOMNode(this);

        if (this_el instanceof HTMLElement) {
            this_el.querySelector(".user-dropdown").classList.toggle("open");
        }
    };

    searchAnime = search_term => {
        if (search_term.length >= 3) {
            RequestUtilities.sendGetRequest(`anime/search?text=${search_term}`, false).then(res => {
                this.setState({search_results: res.data}, () => {
                    this.toggleSearchResults("show");
                });
            }).catch(err => {
                this.setState({search_results: []});
                this.toggleSearchResults("hide");
            });
        } else {
            this.toggleSearchResults("hide");
            this.setState({search_results: []});
        }
    };

    componentDidMount() {
        let this_el = ReactDOM.findDOMNode(this);

        if (this_el instanceof HTMLElement) {
            let search_input_container = this_el.querySelector(".search-input-container");
            let search_icon = this_el.querySelector(".search-icon");
            let search_result_box = this_el.querySelector(".search-result-box");

            document.addEventListener("mousedown", event => {
                if (!search_input_container.contains(event.target) && !search_icon.contains(event.target) && !search_result_box.contains(event.target)) {
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
                        <i className="fas fa-bars fa-17x icon" role="button" name="burger-button" onClick={this.toggleSidebar} tabIndex="1"/>
                        <Link to="/" tabIndex="3"
                              onClick={
                                  event => {
                                      App.hideSidebar();
                                      App.loseFocus();
                                  }
                              }>
                            <img className="logo" src="/images/logo.webp" alt="Logo" height="50"/>
                        </Link>
                    </div>
                    <div className="search-area">
                        <div className="search-input-container">
                            <input className="search-input" name="search-input" tabIndex={-1} id="search-input" placeholder="eg: Fairy Tail" spellCheck={false} type="text"
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
                        <div className="icon search-icon" role="button" name="search-button" tabIndex={0} onClick={event => this.toggleSearchBar()}>
                            <i className="fas fa-search fa-17x"/>
                        </div>
                    </div>
                    <div className="user-area cursor-pointer" onClick={this.toggleUserDropdown}>
                        <img className="user-badge-avatar circle" src="http://via.placeholder.com/100" alt="User Area Avatar"/>
                        <i className="fas fa-caret-down"/>
                        <div className="user-dropdown">
                            <ul className="user-dropdown-option-list">
                                <li className="user-dropdown-option"><i className="fas fa-sign-in-alt"/><span className="user-dropdown-option-text">Login</span></li>
                                <li className="user-dropdown-option"><i className="fas fa-user-plus"/><span className="user-dropdown-option-text">Register</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

};