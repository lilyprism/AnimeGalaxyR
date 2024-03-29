import React from 'react';

import OldAnimeDetails from "./OldAnimeDetails";
import OldAnimeEpisodeList from "./OldAnimeEpisodeList";
import RequestUtilities from "./../../util/RequestUtilities";

export default class OldAnimePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            anime: null
        };
        this.getEpisodeDetails();
    }

    getEpisodeDetails = () => {
        RequestUtilities.sendGetRequest(`anime/${this.props.match.params.id}`, false).then(res => {
            this.setState({anime: res.data});
        });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.getEpisodeDetails();
        }
    }

    render() {
        if (this.state.anime !== null) {
            return (
                <div className="anime-page-container">
                    <div className="spacer"/>
                    <OldAnimeDetails anime={this.state.anime}/>
                    <OldAnimeEpisodeList anime={this.state.anime}/>
                </div>
            );
        } else {
            return (
                <div>Nada para ver aqui...</div>
            );
        }
    }

};