import React from 'react';
import {Link} from "react-router-dom";

import "./animepageepisodecard.sass";

export default class AnimePageEpisodeCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            item: this.props.item
        }
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.item !== prevProps.item) {
            this.setState({item: this.props.item});
            console.log("Hey");
        }
    }

    render() {
        return (
            <div className={`${this.props.className} animepage-episode-card`}>
                <Link to={`/v/${this.props.item.id}`}>
                    <div className="card-image-container">
                        <img className="card-img" src={this.props.item.season.anime.image} alt="Episode"/>
                    </div>
                </Link>
                <div className="card-body">
                    <div className="card-episode-top-container">
                        <div className="card-episode-number-container">
                            <div className="card-episode-number">
                                {`T${this.state.item.season.number} E${this.state.item.number}`}
                            </div>
                        </div>
                    </div>
                    {
                        this.props.is_logged_in ?
                            <div className="card-episode-options">
                                <span className="seen-checkmark"><i className={`card-option fas fa-check fa-fw ${this.state.item.favorite ? "active" : ""}`}/></span>
                            </div>
                            :
                            ""
                    }

                    <Link to={`/v/${this.props.item.id}`}>
                        <div className="card-episode-info">
                            <div className="card-episode-name">
                                {this.props.item.season.anime.name}
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