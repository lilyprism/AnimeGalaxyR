import React from 'react';

import "./carousel.sass";

export default class Carousel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            items: [
                {
                    image: "http://via.placeholder.com/1920x750?text=1"
                }, {
                    image: "http://via.placeholder.com/1920x750?text=2"
                }, {
                    image: "http://via.placeholder.com/1920x750?text=3"
                },
            ]
        };
        this.initOrder();
    }

    initOrder() {
        let items = this.state.items;
        items.concat(items);
        for (let i = 0; i < items.length; i++) {
            items[i].order = i + 1;
        }
    }

    moveLeft = () => {
        let items = this.state.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].order === 1) {
                items[i].order = items[i].order = items.length;
            } else {
                items[i].order = items[i].order - 1;
            }
        }
        this.setState({items: items});
    };

    moveRight = () => {
        let items = this.state.items;
        for (let i = 0; i < items.length; i++) {
            items[i].order = items[i].order % items.length + 1;
        }
        this.setState({items: items});
    };

    render() {
        return (
            <div className="carousel">
                <span className="prev-btn" onClick={this.moveRight}><i className="fas fa-play"/></span>
                <ul className="carousel-list">
                    {this.state.items.map((item, index) => {
                        return (
                        <li style={{order: item.order}} key={index} className="carousel-list-item">
                            <img className="carousel-list-item-img" src={item.image} alt=""/>
                            <span className="carousel-list-item-play"><i className="fas fa-play fa-fw"/></span>
                        </li>
                        );
                    })}
                </ul>
                <span className="next-btn" onClick={this.moveLeft}><i className="fas fa-play"/></span>
            </div>
        );
    }

};