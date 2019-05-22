import React from 'react';
import './sass/topbar.sass';

export default class Topbar extends React.Component {

    render() {
        return (
            <nav className="topbar">
                <i className="fas fa-bars fa-2x icon" role="button"/>
                <img className="logo" src="images/logo.png" alt="Logo" height="50"/>
                <div className="search-area">
                    <input className="search-input" id="search-input" type="text"/>
                    <label htmlFor="search-input" className="icon search-icon" role="button">
                        <i className="fas fa-search fa-2x"/>
                    </label>
                </div>
            </nav>
        );
    }

};