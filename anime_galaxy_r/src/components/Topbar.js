import React from 'react';
import './sass/topbar.sass';
import {Link} from "react-router-dom";

export default class Topbar extends React.Component {

    toggleSidebar() {
        let sidebar_el = document.querySelector(".sidebar");
        let content_el = document.querySelector(".content-wrapper");

        sidebar_el.classList.toggle("open");
        content_el.classList.toggle("dimmed");
    }

    render() {
        return (
            <nav className="topbar">
                <div className="topbar-container breakpoint-container">
                    <div className="logo-burger-container">
                        <i className="fas fa-bars fa-2x icon" role="button" onClick={this.toggleSidebar}/>
                        <Link to="/">
                            <img className="logo" src="images/logo.png" alt="Logo" height="50"/>
                        </Link>
                    </div>
                    <div className="search-area">
                        <input className="search-input" id="search-input" type="text"/>
                        <label htmlFor="search-input" className="icon search-icon" role="button">
                            <i className="fas fa-search fa-2x"/>
                        </label>
                    </div>
                </div>
            </nav>
        );
    }

};