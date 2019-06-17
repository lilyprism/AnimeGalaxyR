import React from "react";
import {ToastsStore} from "react-toasts";

import "../modalwindow/modalwindow.sass";

import ModalWindow from "../modalwindow/ModalWindow";

export default class LoginModal extends ModalWindow {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: ""
        };
    }

    handleSubmit = event => {
        event.preventDefault();

        this.props.login(this.state.username, this.state.password).then(res => {
            if (res === true) {
                console.log(res);
                ToastsStore.success("Entraste com sucesso");
                ModalWindow.closeModal(this.props.element_id);
            }
        });
    };

    render() {
        return (
            <div id={this.props.element_id} className="modal-container">
                <div className="modal-overlay" onClick={this.handleOverlayClick}/>
                <div className="modal">
                    <span className="modal-close-btn" onClick={() => ModalWindow.closeModal(this.props.element_id)}>X</span>
                    <header className="modal-header">
                        <h1 className="title"><span>Login</span></h1>
                    </header>
                    <form className="login-form w-100" action="" onSubmit={this.handleSubmit}>
                        <div className="modal-body">
                            <div className="login-container">
                                <div className="form-group">
                                    <label htmlFor="username-input">Username</label>
                                    <input className="input" spellCheck="false" type="text" name="username" id="username-input" onChange={event => this.setState({username: event.target.value})}/>
                                    <sub className="invalid-form-msg">Algo de errado não está certo</sub>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password-input">Password</label>
                                    <input className="input" type="password" name="password" id="password-input" onChange={event => this.setState({password: event.target.value})}/>
                                    <sub className="invalid-form-msg">Algo de errado não está certo</sub>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <input className="btn" type="submit" value="Login"/>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

}