import React from 'react';

import "./footer.sass";

export default class Footer extends React.Component {

    render() {
        return (
            <footer className="footer">
                <div className="border-bottom-red"/>
                <div className="footer-text"><sub>&copy; 2019 AnimeGalaxy.me</sub></div>
            </footer>
        );
    }

};