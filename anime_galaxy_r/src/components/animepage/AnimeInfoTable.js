import React from 'react';
import moment from 'moment';
import 'moment/locale/pt';

import "./animeinfotable.sass";

export default class AnimeInfoTable extends React.Component {

    render() {
        let start_date = moment(this.props.anime.start_date);
        start_date.locale("pt");

        if (this.props.anime != null) {
            return (
                <div className="anime-info-table">
                    <div className="anime-info-table-cell">
                        <div className="anime-info-table-cell-content">
                            Autor: {this.props.anime.author.name}
                        </div>
                    </div>

                    <div className="anime-info-table-cell">
                        <div className="anime-info-table-cell-content">
                            Diretor: {this.props.anime.director.name}
                        </div>
                    </div>

                    <div className="anime-info-table-cell">
                        <div className="anime-info-table-cell-content">
                            Estúdio: {this.props.anime.studio.name}
                        </div>
                    </div>
                    <div className="anime-info-table-cell">
                        <div className="anime-info-table-cell-content">
                            Visualizações: {this.props.anime.views}
                        </div>
                    </div>
                    <div className="anime-info-table-cell">
                        <div className="anime-info-table-cell-content">
                            Estado: {this.props.anime.ongoing ? "A decorrer" : "Acabada"}
                        </div>
                    </div>
                    <div className="anime-info-table-cell">
                        <div className="anime-info-table-cell-content">
                            Data de Lançamento: {start_date.format("D [de] MMMM [de] YYYY")}
                        </div>
                    </div>
                </div>
            );
        } else {
            return "";
        }
    }

}