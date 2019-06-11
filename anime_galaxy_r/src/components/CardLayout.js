import React from 'react';

import "./sass/cardlayout.sass"
import {Link} from "react-router-dom";

class LatestEpisodeCard extends React.Component {

    render() {
        return (
            <div className="card">
                <Link to={`/v/${this.props.item.id}`}>
                    <div className="card-body">
                        <div className="card-title">
                            <span>{this.props.item.anime.name}</span>
                        </div>
                    </div>
                    <div className="card-image-container">
                        <img className="card-image" src={this.props.item.anime.image} alt="Card"/>
                        <span className="card-episode-number">
                            EP {this.props.item.number}
                        </span>
                        <i className="fas fa-play play-icon fa-fw"/>
                    </div>
                </Link>
            </div>
        );
    }

}

class EpisodeListCard extends React.Component{

    render() {
        return (
            <div className="card">
                <Link to={`/v/${this.props.item.id}`}>
                    <div className="card-body">
                        <div className="card-title">
                            <span>Episódio {this.props.item.number}</span>
                        </div>
                    </div>
                    <div className="card-image-container">
                        <img className="card-image" src={this.props.image} alt="Card"/>
                        <i className="fas fa-play play-icon"/>
                    </div>
                </Link>
            </div>
        );
    }

}

export default class CardLayout extends React.Component {

    render() {
        let cards;
        if (this.props.card_type === "EpisodeListCard") {
            cards = this.props.items.map((value, index) => {
                return <EpisodeListCard item={value} image={this.props.image} key={index}/>
            });
        } else {
            cards = this.props.items.map(function (value, index) {
                return <LatestEpisodeCard item={value} key={index}/>
            });
        }

        if (this.props.items.length > 0) {
            return (
                <div className="card-layout">
                    {cards}
                </div>
            );
        } else {
            return (
                <div>Nada para ver aqui...</div>
            );
        }
    }

};