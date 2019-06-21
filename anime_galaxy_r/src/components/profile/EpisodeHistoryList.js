import React from 'react';

import "./episodehistorylist.sass";

export default class EpisodeHistoryList extends React.Component {

    render() {
        return (
            <div className="episodehistorylist-container">
                <ul className="episodehistorylist">
                    {this.props.items.map(function (item, index) {
                        return <li className="episodehistorylist-item" key={item.episode.id}>{`${item.episode.anime.name} - ${item.episode.number}`}</li>
                    })}
                </ul>
            </div>
        );
    }

};