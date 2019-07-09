import React from 'react';

import "./oldanimedetails.sass";

export default class OldAnimeDetails extends React.Component {

    render() {
        if (this.props.anime !== null) {
            let desc_html = {__html: this.props.anime.description};

            return (
                <div className="anime-info">
                    <div className="anime-details-img">
                        <img src={this.props.anime.image} alt="" width="150"/>
                    </div>
                    <div className="anime-desc">
                        <h1 className="title"><span>{this.props.anime.name}</span></h1>
                        <div className="anime-details-tags">
                            {this.props.anime.genres.map(function (tag, index) {
                                return <span className="anime-details-tag" key={tag.id}>{tag.name}</span>;
                            })}
                        </div>
                        <p className="synopsis" dangerouslySetInnerHTML={desc_html}/>
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