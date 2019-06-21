import ReactDOM from "react-dom";
import {ToastsStore} from "react-toasts";
import React from "react";

import RequestUtilities from "../util/RequestUtilities";

export default class Report extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            is_open: false
        }
    }

    openReport = () => {
        this.setState({is_open: true});

        let this_el = ReactDOM.findDOMNode(this);
        if (this_el instanceof HTMLElement) {
            let dropdown_el = this_el.querySelector(".report-dropdown-container");
            dropdown_el.classList.add("open");
        }
    };

    closeReport = () => {
        this.setState({is_open: false});

        let this_el = ReactDOM.findDOMNode(this);
        if (this_el instanceof HTMLElement) {
            let dropdown_el = this_el.querySelector(".report-dropdown-container");
            dropdown_el.classList.remove("open");
        }
    };

    toggleReport = () => {
        if (this.state.is_open) {
            let this_el = ReactDOM.findDOMNode(this);
            if (this_el instanceof HTMLElement) {
                let dropdown_el = this_el.querySelector(".report-dropdown-container");
                dropdown_el.classList.remove("open");
            }
        } else {
            let this_el = ReactDOM.findDOMNode(this);
            if (this_el instanceof HTMLElement) {
                let dropdown_el = this_el.querySelector(".report-dropdown-container");
                dropdown_el.classList.add("open");
            }
        }
        this.setState({is_open: !this.state.is_open});
    };

    report = (type = 0) => {
        if (type === 0) {
            RequestUtilities.sendPostRequest("report/video", {info: this.props.episode.id}, false).then(res => {
                console.log("Video reported");
                ToastsStore.error("Obrigado por reportar este vídeo, investigaremos o problema o mais cedo possível");
            }).catch(res => {
                // ToastsStore.error("Ocorreu um erro. Por favor tente mais tarde.");
            });
        } else {
            RequestUtilities.sendPostRequest("report/video/other", {info: this.props.episode.id}, false).then(res => {
                console.log("Video reported");
                ToastsStore.error("Obrigado por reportar este vídeo, investigaremos o problema o mais cedo possível");
            }).catch(res => {
                // ToastsStore.error("Ocorreu um erro. Por favor tente mais tarde.");
            });
        }
    };

    reportComment = (type = 0) => {
        if (type === 0) {
            RequestUtilities.sendPostRequest("report/comment/spoiler", {info: this.props.comment.id}, false).then(res => {
                console.log("Comment reported");
                ToastsStore.error("Obrigado por reportar este comentário");
            }).catch(error => {
                console.log(error);
                ToastsStore.error("Ocorreu um erro. Por favor tente mais tarde.");
            });
        } else {
            RequestUtilities.sendPostRequest("report/comment/offensive", {info: this.props.comment.id}, false).then(res => {
                console.log("Comment reported");
                ToastsStore.error("Obrigado por reportar este comentário");
            }).catch(error => {
                console.log(error);
                ToastsStore.error("Ocorreu um erro. Por favor tente mais tarde.");
            });
        }
    };

    render() {
        let report_dropdown =
            <div className="report-dropdown video-report-dropdown">
                <div className="report-dropdown-options">
                    <div tabIndex={0} className="report-option" onClick={this.report}><i className="fas fa-flag fa-fw"/> Video não funciona</div>
                    <div tabIndex={0} className="report-option" onClick={() => this.report(1)}><i className="fas fa-flag fa-fw"/> Outro problema</div>
                </div>
            </div>;

        if (this.props.type.toLowerCase() === "comment") {
            report_dropdown =
                <div className="report-dropdown comment-report-dropdown">
                    <div className="report-dropdown-options">
                        <div tabIndex={0} className="report-option" onClick={this.reportComment}>Spoilers</div>
                        <div tabIndex={0} className="report-option" onClick={() => this.reportComment(1)}>Conteúdo ofensivo</div>
                    </div>
                </div>
        }

        return (
            <div className="report-container" onMouseLeave={this.closeReport}>
                <div className="report-dropdown-container">
                    {report_dropdown}
                </div>
                <div tabIndex={0} className="report-option" onClick={this.toggleReport}><i className="fas fa-flag fa-fw"/></div>
            </div>
        );
    }

}