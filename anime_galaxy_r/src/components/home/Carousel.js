import React from 'react';

import "./carousel.sass";

export default class Carousel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            items: [
                {
                    image: "http://via.placeholder.com/1920x750?text=Hello",
                    order: 0
                }, {
                    image: "http://via.placeholder.com/1920x750?text=There",
                    order: 0
                }, {
                    image: "http://via.placeholder.com/1920x750?text=General",
                    order: 0
                }, {
                    image: "http://via.placeholder.com/1920x750?text=Kenobi",
                    order: 0
                },
            ],
            isMoving: false
        };
    }

    componentDidMount() {
        this.initOrder();
    }


    initOrder() {
        let items = [];

        for (let i = 0; i < 2; i++) {
            for (let i = 0; i < this.state.items.length; i++) {
                items.push({image: this.state.items[i].image, order: this.state.items[i].order});
            }
        }

        console.log(items);
        for (let i = 0; i < items.length; i++) {
            console.log(i + " -> " + (i + 1));
            items[i].order = (i + 1) % items.length + 1;
        }
        this.setState({items: items});
    }

    moveLeft = () => {
        if (this.state.isMoving === false) {
            let items = [...this.state.items];

            this.setState({isMoving: "move-left"}, () => {
                setTimeout(() => {
                    for (let i = 0; i < items.length; i++) {
                        if (items[i].order === 1) {
                            items[i].order = items[i].order = items.length;
                        } else {
                            items[i].order = items[i].order - 1;
                        }
                    }

                    this.setState({isMoving: false});
                }, 300);
            });
        }
    };

    moveRight = () => {
        if (this.state.isMoving === false) {
            let items = [...this.state.items];

            this.setState({isMoving: "move-right"}, () => {
                setTimeout(() => {
                    for (let i = 0; i < items.length; i++) {
                        items[i].order = items[i].order % items.length + 1;
                    }

                    this.setState({isMoving: false});
                }, 300);
            });
        }
    };

    render() {
        return (
            <div className="carousel">
                <span className="prev-btn" onClick={this.moveRight}><i className="fas fa-play"/></span>
                <ul className="carousel-list">
                    {this.state.items.map((item, index) => {
                        return (
                            <li style={{order: item.order}} key={index} className={`carousel-list-item ${this.state.isMoving ? this.state.isMoving : ""}`}>
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