import React from 'react';

import "./cardlayout.sass"
import {Link} from "react-router-dom";

class LatestEpisodeCard extends React.Component {

    render() {
        return (
            <div className="card">
                <Link to={`/v/${this.props.item.id}`}>
                    <div className="card-body">
                        <div className="card-title">
                            <span>{this.props.item.anime.name} - {this.props.item.number}</span>
                        </div>
                    </div>
                    <img className="card-image" src={this.props.item.anime.image} alt="Card"/>
                </Link>
            </div>
        );
    }

}

export default class CardLayout extends React.Component {

    render() {
        let array = this.props.items;

        return (
            <div className="card-layout">
                {array.map(function (item, index) {
                    return <LatestEpisodeCard item={item} key={item.id}/>
                })}
            </div>
        );
    }

};