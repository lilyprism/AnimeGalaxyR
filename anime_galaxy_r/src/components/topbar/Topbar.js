import React from 'react';
import {Link} from "react-router-dom";
import * as ReactDOM from "react-dom";

import './topbar.sass';

import App from "../App";
import ModalWindow from "../modalwindow/ModalWindow.js";

export default class Topbar extends React.Component {

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
                this_el.querySelector(".search-area").classList.toggle("open");
            } else if (value === "hide") {
                this_el.querySelector(".search-area").classList.remove("open");
            } else if (value === "show") {
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

    toggleUserDropdown = () => {
        let this_el = ReactDOM.findDOMNode(this);

        if (this_el instanceof HTMLElement) {
            this_el.querySelector(".user-dropdown").classList.toggle("open");
        }
    };

    handleLoginClick = () => {
        ModalWindow.openModal("login-modal");
    };

    handleRegisterClick = () => {
        console.log("Hello there");
        ModalWindow.openModal("register-modal");
    };

    componentDidMount() {
        let this_el = ReactDOM.findDOMNode(this);

        if (this_el instanceof HTMLElement) {
            let search_input_container = this_el.querySelector(".search-input-container");
            let search_icon = this_el.querySelector(".search-icon");

            document.addEventListener("mousedown", event => {
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
                        <i className="fas fa-bars fa-17x icon" role="button" aria-label="Sidebar button toggler" onClick={this.toggleSidebar} tabIndex="1"/>
                        <Link to="/" tabIndex="3"
                              onClick={
                                  () => {
                                      this.props.setSearch("");
                                      App.hideSidebar();
                                      App.loseFocus();
                                  }
                              }>
                            <img className="logo" src="/images/logo.webp" alt="Logo" height="50"/>
                        </Link>
                    </div>
                    <div className="search-area">
                        <div className="search-input-container">
                            <input className="search-input" name="search-input" aria-label="Search input field" tabIndex={-1} id="search-input" placeholder="eg: Fairy Tail" spellCheck={false} type="text"
                                   onChange={
                                       event => {
                                           this.props.setSearch(event.target.value);
                                       }
                                   }
                            />
                        </div>
                        <div className="icon search-icon" role="button" aria-label="Search Button" tabIndex={0} onClick={event => this.toggleSearchBar()}>
                            <i className="fas fa-search fa-17x"/>
                        </div>
                    </div>
                    <div className="user-area cursor-pointer" onClick={this.toggleUserDropdown}>
                        <img className="user-badge-avatar circle" src="/images/avatar.webp" alt="User Area Avatar"/>
                        <i className="fas fa-caret-down"/>
                        <div className="user-dropdown">
                            <ul className="user-dropdown-option-list">
                                {
                                    this.props.is_logged_in ?
                                        <li className="user-dropdown-option" onClick={this.props.logout}><i className="fas fa-sign-out-alt"/><span className="user-dropdown-option-text">Logout</span></li>
                                        :
                                        <li className="user-dropdown-option" onClick={this.handleLoginClick}><i className="fas fa-sign-in-alt"/><span className="user-dropdown-option-text">Login</span></li>
                                }
                                {
                                    this.props.is_logged_in ?
                                        ""
                                        :
                                        < li className="user-dropdown-option" onClick={this.handleRegisterClick}><i className="fas fa-user-plus"/><span className="user-dropdown-option-text">Register</span></li>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

};