import React from 'react';

import "./sass/cardlayout.sass"

class Card extends React.Component {

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <p>Card Title</p>
                </div>
                <img className="card-image" src="http://via.placeholder.com/298x428" alt="Card Image"/>
            </div>
        );
    }

}

export default class CardLayout extends React.Component {

    render() {
        let array = new Array(12);
        array.fill(1, 0, 12);

        return (
            <div className="card-layout">
                {array.map(function (value, index) {
                    return <Card key={index}/>
                })}
            </div>
        );
    }

};