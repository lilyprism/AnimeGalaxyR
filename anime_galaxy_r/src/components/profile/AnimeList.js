import React from 'react';

import "./animelist.sass";

export default class AnimeList extends React.Component {

    render() {
        return (
            <div className="animelist-container">
                <ul className="animelist">
                    <li className="animelist-item">#1 Anime Name Here</li>
                    <li className="animelist-item">#2 Anime Name Here</li>
                    <li className="animelist-item">#3 Anime Name Here</li>
                    <li className="animelist-item">#4 Anime Name Here</li>
                    <li className="animelist-item">#5 Anime Name Here</li>
                    <li className="animelist-item">#6 Anime Name Here</li>
                    <li className="animelist-item">#7 Anime Name Here</li>
                    <li className="animelist-item">#8 Anime Name Here</li>
                    <li className="animelist-item">#9 Anime Name Here</li>
                    <li className="animelist-item">#10 Anime Name Here</li>
                </ul>
            </div>
        );
    }

};