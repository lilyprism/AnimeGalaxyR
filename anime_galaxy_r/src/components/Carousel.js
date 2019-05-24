import React from 'react';

import './sass/carousel.sass';
import * as ReactDOM from "react-dom";

class CarouselItem extends React.Component {

    render() {
        return (
            <div className="carousel-item">
                <img className="carousel-img" src={`http://via.placeholder.com/298x428?text=${this.props.index}`} alt=""/>
            </div>
        );
    }

}

export default class Carousel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            moving: false,
            position: 0,
            items: [
                {
                    img: "http://via.placeholder.com/250x320",
                    title: "Fairy Tail",
                    link: ""
                }, {
                    img: "http://via.placeholder.com/250x320",
                    title: "One Piece",
                    link: ""
                }, {
                    img: "http://via.placeholder.com/250x320",
                    title: "Boku No Hero Academia",
                    link: ""
                }, {
                    img: "http://via.placeholder.com/250x320",
                    title: "Boku no Pico",
                    link: ""
                }, {
                    img: "http://via.placeholder.com/250x320",
                    title: "Ajin",
                    link: ""
                }
            ]
        };
    }

    move = (amount) => {
        this.setState({position: this.state.position + amount});

        // let this_el = ReactDom.findDOMNode(this);
        // if (this_el instanceof HTMLElement) {
        //     let carousel_group_el = this_el.querySelector(".carousel-item-group");
        //
        // }
    };

    render() {

        return (
            <div className="carousel">
                <div className="carousel-prev">
                    <i className="fas fa-arrow-left fa-fw"/>
                </div>
                <div className="carousel-item-group">
                    <CarouselItem index="1"/>
                    <CarouselItem index="2"/>
                    <CarouselItem index="3"/>
                    <CarouselItem index="4"/>
                    <CarouselItem index="5"/>
                    <CarouselItem index="6"/>
                    <CarouselItem index="7"/>
                    <CarouselItem index="8"/>
                    <CarouselItem index="9"/>
                    <CarouselItem index="10"/>
                    <CarouselItem index="11"/>
                    <CarouselItem index="12"/>
                </div>
                <div className="carousel-next">
                    <i className="fas fa-arrow-right fa-fw"/>
                </div>
            </div>
        );
    }

};