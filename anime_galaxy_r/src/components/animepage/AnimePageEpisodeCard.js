import React from 'react';
import {Link} from "react-router-dom";

import "./animepageepisodecard.sass";

export default class AnimePageEpisodeCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isMouseOver: false,
            loadGif: false
        }
    }

    render() {
        return (
            <div className={`${this.props.className} animepage-episode-card`} onMouseEnter={() => this.setState({loadGif: true, isMouseOver: true})} onMouseLeave={() => this.setState({isMouseOver: false})}>
                <Link to={`/v/${this.props.item.id}`}>
                    <div className="card-image-container">
                        <img className="card-img" src={this.props.item.image} alt="Episode"/>
                        {this.state.loadGif ? <img className={`card-gif${this.state.isMouseOver ? " show" : ""}`} src={this.props.item.gif} alt="Episode Preview"/> : ""}
                    </div>
                </Link>
                <div className="card-body">
                    <div className="card-episode-top-container">
                        <div className="card-episode-number-container">
                            <div className="card-episode-number">
                                {`Ep ${this.props.item.number}`}
                            </div>
                        </div>
                    </div>
                    {
                        this.props.is_logged_in ?
                            <div className="card-episode-options">
                                <span className="seen-checkmark"><i className={`card-option fas fa-check fa-fw ${this.props.item.favorite ? "active" : ""}`}/></span>
                            </div>
                            :
                            ""
                    }

                    <Link to={`/v/${this.props.item.id}`}>
                        <div className="card-episode-info">
                            <div className="card-episode-name">
                                {this.props.anime.name}
                            </div>
                        </div>
                    </Link>
                </div>
                <Link to={`/v/${this.props.item.id}`}>
                    <span className="card-play-icon"><i className="fas fa-play fa-fw"/></span>
                    <div className="card-gradient-overlay"/>
                </Link>
            </div>
        );
    }

};