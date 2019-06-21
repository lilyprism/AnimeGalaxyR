import React from 'react';

import "./list.sass";

export default class AnimeList extends React.Component {

    render() {
        return (
            <div className="animelist-container">
                <ul className="list animelist">
                    {this.props.items.map(function (item, index) {
                        return <li className="list-item animelist-item" key={item.episode.anime.id}>{`${item.episode.anime.name}`}</li>
                    })}
                </ul>
            </div>
        );
    }

};