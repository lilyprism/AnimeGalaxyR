import React from 'react';

import "./carousel.sass";

export default class Carousel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            items: this.props.items,
            isMoving: false
        };
    }

    componentDidMount() {
        this.initOrder();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.items !== this.props.items) {
            this.initOrder();
        }
    }

    initOrder() {
        let items = [];

        for (let i = 0; i < Math.min(2, this.props.items.length); i++) {
            for (let i = 0; i < this.props.items.length; i++) {
                items.push(
                    {
                        id: this.props.items[i].id,
                        image: this.props.items[i].thumbnail,
                        name: this.props.items[i].name
                    }
                );
            }
        }

        for (let i = 0; i < items.length; i++) {
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
                {this.state.items.length > 1 ? <span className="prev-btn" onClick={this.moveRight}><i className="fas fa-play"/></span> : ""}
                <ul className={`carousel-list ${this.state.items.length > 1 ? "cyclable" : ""}`}>
                    {this.state.items.map((item, index) => {
                        return (
                            <li style={{order: item.order, backgroundImage: `url(${item.image})`}} key={item.id} className={`carousel-list-item ${this.state.isMoving ? this.state.isMoving : ""}`}>
                                <span className="carousel-list-item-play"><i className="fas fa-play fa-fw"/></span>
                                <div className="carousel-list-item-title">
                                    <span className="carousel-list-title-text">{item.name}</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                {this.state.items.length > 1 ? <span className="next-btn" onClick={this.moveLeft}><i className="fas fa-play"/></span> : ""}
            </div>
        );
    }

};