import React from 'react';

import './sass/sidebar.sass';
import {Link} from "react-router-dom";
import * as ReactDOM from "react-dom";

export default class Sidebar extends React.Component {

    componentDidMount() {
        let sidebar_links = ReactDOM.findDOMNode(this).querySelectorAll("a");

        for (let i = 0; i < sidebar_links.length; i++) {
            sidebar_links[i].tabIndex = -1;
        }
    }

    render() {
        return (
            <div className="sidebar">
                <Link to="/anime">
                    <div className="sidebar-item">
                        <i className="fas fa-list fa-fw"/> Anime
                    </div>
                </Link>
                <Link to="/top">
                    <div className="sidebar-item">
                        <i className="fas fa-trophy fa-fw"/> Top
                    </div>
                </Link>
                <Link to="/calendar">
                    <div className="sidebar-item">
                        <i className="fas fa-calendar-alt fa-fw"/> Calendário
                    </div>
                </Link>
                <Link to="/random">
                    <div className="sidebar-item">
                        <i className="fas fa-random fa-fw"/> Aleatório
                    </div>
                </Link>
            </div>
        );
    }

};