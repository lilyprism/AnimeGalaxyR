import React from 'react';

import "./homeanimecard.sass";
import {Link} from "react-router-dom";

export default class HomeAnimeCard extends React.Component {

    render() {
        let taglessDesc = this.props.item.description.replace(/<.+?>/g, "");
        let description = taglessDesc.substring(0, taglessDesc.substring(0, 170).lastIndexOf(" ")).trim() + "...";

        return (
            <div className={`${this.props.className} home-anime-card`}>
                <Link to={`/anime/${this.props.item.id}`}>
                    <div className="card-image-container">
                        <img className="card-img" src={this.props.item.image} alt="Episode"/>
                        <div className="card-hover-desc">
                            <div className="anime-genres">
                                {this.props.item.genres.slice(0, 3).map((genre, index) => {
                                    return (
                                        <div className="anime-genre" key={genre.id}>{genre.name}</div>
                                    )
                                })}
                            </div>
                            <div className="anime-desc">
                                <div className="anime-desc-text" dangerouslySetInnerHTML={{__html: description}}>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="card-anime-info">
                            <div className="card-anime-name">
                                {this.props.item.name}
                            </div>
                            <div className="card-anime-views">
                                <i className={`card-option fas fa-eye fa-fw`}/> {this.props.item.views != null ? this.props.item.views.toString().replace(/(\d+?)(?=(\d{3})+(?!\d)|$)/g, "$&,").slice(0, -1) : ""}
                            </div>
                        </div>
                    </div>
                    <div className="card-gradient-overlay"/>
                </Link>
            </div>
        );
    }

};