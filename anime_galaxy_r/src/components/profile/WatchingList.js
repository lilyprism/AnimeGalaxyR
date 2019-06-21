import React from 'react';

export default class WatchingList extends React.Component {

    render() {
        return (
            <div className="watchinglist-container">
                <ul className="list watchinglist">
                    {this.props.items.map(function (item, index) {
                        return <li className="list-item watchinglist-item" key={item.episode.id}>{`${item.episode.anime.name} - ${item.episode.number}`}</li>
                    })}
                </ul>
            </div>
        );
    }

};