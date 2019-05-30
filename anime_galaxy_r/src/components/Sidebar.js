import React from 'react';

import './sass/sidebar.sass';
import {Link} from "react-router-dom";
import * as ReactDOM from "react-dom";
import App from "./App";

export default class Sidebar extends React.Component {

    componentDidMount() {
        let sidebar_links = ReactDOM.findDOMNode(this).querySelectorAll("a");

        for (let i = 0; i < sidebar_links.length; i++) {
            sidebar_links[i].tabIndex = -1;
        }
    }

    render() {
        return (
            <div className="sidebar sidebar-transition">
                <Link to="/anime" onClick={App.hideSidebar}>
                    <div className="sidebar-item">
                        <i className="fas fa-list fa-fw"/> Anime
                    </div>
                </Link>
                <Link to="/top" onClick={App.hideSidebar}>
                    <div className="sidebar-item">
                        <i className="fas fa-trophy fa-fw"/> Top
                    </div>
                </Link>
                <Link to="/calendar" onClick={App.hideSidebar}>
                    <div className="sidebar-item">
                        <i className="fas fa-calendar-alt fa-fw"/> Calendário
                    </div>
                </Link>
                <Link to="/random" onClick={App.hideSidebar}>
                    <div className="sidebar-item">
                        <i className="fas fa-random fa-fw"/> Aleatório
                    </div>
                </Link>
                <div className="login-item-container">
                    <Link to="/login" onClick={App.hideSidebar}>
                        <div className="sidebar-item">
                            <i className="fas fa-sign-in-alt fa-fw"/> Login
                        </div>
                    </Link>
                    <Link to="/register" onClick={App.hideSidebar}>
                        <div className="sidebar-item">
                            <i className="fas fa-user-plus fa-fw"/> Register
                        </div>
                    </Link>
                </div>
            </div>
        );
    }

};