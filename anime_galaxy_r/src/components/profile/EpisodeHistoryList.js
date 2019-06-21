import React from 'react';
import moment from 'moment';
import 'moment/locale/pt';

import "./list.sass";

export default class EpisodeHistoryList extends React.Component {

    render() {
        return (
            <div className="episodehistorylist-container">
                <ul className="list episodehistorylist">
                    {this.props.items.map(function (item, index) {
                        let time = moment(item.date);
                        time.locale("pt");
                        let time_ago = time.fromNow();
                        return <li className="list-item episodehistorylist-item" key={item.episode.id}>{`${item.episode.anime.name} - ${item.episode.number} - ${time_ago}`}</li>
                    })}
                </ul>
            </div>
        );
    }

};