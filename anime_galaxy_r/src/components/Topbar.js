import React from 'react';
import './sass/topbar.sass';
import {Link} from "react-router-dom";
import App from "./App";

export default class Topbar extends React.Component {

    toggleSidebar() {
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
                        <input className="search-input" id="search-input" type="text"/>
                        <label htmlFor="search-input" className="icon search-icon" role="button">
                            <i className="fas fa-search fa-17x"/>
                        </label>
                    </div>
                </div>
            </nav>
        );
    }

};