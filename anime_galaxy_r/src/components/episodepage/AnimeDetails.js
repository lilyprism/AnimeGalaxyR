import React from 'react';

import "./episodeanimedetails.sass";

export default class AnimeDetails extends React.Component {

    render() {
        if (this.props.anime !== null) {
            return (
                <div className="episode-anime-details">
                    <div className="episode-anime-details-img">
                        <img src={this.props.anime.image} alt="Anime"/>
                    </div>
                    <div className="episode-anime-desc">
                        <div className="episode-anime-details-tags">
                            {this.props.anime.genres.map(function (tag, index) {
                                return <span className="episode-anime-details-tag" key={tag.id}>{tag.name}</span>;
                            })}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>Wait a second...</div>
            );
        }
    }

};