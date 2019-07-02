import React from 'react';

import "./animelistcard.sass";

export default class AnimeListCard extends React.Component {

    render() {
        return (
            <div className={`${this.props.className} anime-list-card`}>
                <div className="card-image-container">
                    <img className="card-img" src={this.props.item.image} alt="Anime"/>
                </div>
                <div className="card-body">
                    <div className="card-top-container">
                        <div className="card-top-info-container">
                            <div className="card-anime-episodes">
                                {`${this.props.item.episodes} Eps`}
                            </div>
                            <div className="card-anime-views">
                                <i className="fas fa-eye fa-fw"/> {`${this.props.item.views}`}
                            </div>
                        </div>
                    </div>
                    <div className="card-anime-info">
                        <div className="card-anime-name">
                            {this.props.item.name}
                        </div>
                    </div>
                </div>
                <div className="card-gradient-overlay"/>
            </div>
        );
    }

};