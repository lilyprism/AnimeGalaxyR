import React from 'react';

export default class SearchResultBox extends React.Component {

    render() {
        return (
            <div className={this.props.results_open ? "search-result-box open" : "search-result-box"}>
                <ul className="search-result-list">
                    {/*{*/}
                    {/*    this.props.results.map(function (result, index) {*/}
                    {/*        return <li className="search-result-list-item">{result.name}</li>*/}
                    {/*    })*/}
                    {/*}*/}
                    <li>Fairy Tail</li>
                    <li>Fairy Tail</li>
                    <li>Fairy Tail</li>
                    <li>Fairy Tail</li>
                    <li>Fairy Tail</li>
                    <li>Fairy Tail</li>
                    <li>Fairy Tail</li>
                    <li>Fairy Tail</li>
                    <li>Fairy Tail</li>
                </ul>
            </div>
        );
    }

};