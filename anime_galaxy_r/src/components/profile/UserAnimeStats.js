import React from 'react';

import './useranimestats.sass';

export default class UserAnimeStats extends React.Component {

    render() {
        return (
            <div className="useranimestats-container">
                <div className="useranimestats-anime">
                    Animes Acabadas: {this.props.stats.anime}
                </div>
                <div className="useranimestats-eps">
                    Episódios Vistos: {this.props.stats.episodes}
                </div>
                <div className="useranimestats-time">
                    Tempo Visto: {this.props.stats.time}
                </div>
            </div>
        );
    }

};