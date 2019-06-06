import React from 'react';
import {Link} from "react-router-dom";

export default class SearchResultBox extends React.Component {

    render() {
        return (
            <div className={this.props.results_open ? "search-result-box open" : "search-result-box"}>
                <ul className="search-result-list">
                    {
                        this.props.results.map(function (result, index) {
                            return <Link to={`/anime/${result.id}`}><li className="search-result-list-item" key={result.id}>{result.name}</li></Link>
                        })
                    }
                </ul>
            </div>
        );
    }

};