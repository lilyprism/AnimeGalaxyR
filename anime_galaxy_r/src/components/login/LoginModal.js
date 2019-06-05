import React from "react";
import ModalWindow from "../modalwindow/ModalWindow";

import "../modalwindow/modalwindow.sass";
import {ToastsStore} from "react-toasts";

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
            if (res) {
                console.log(res);
                ToastsStore.success("Entraste com sucesso seu murcão");
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
                    <div className="modal-body">
                        <div className="login-container">
                            <form className="login-form" action="" onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="username-input">Username</label>
                                    <input className="input" spellCheck="false" type="text" name="username" id="username-input" onChange={event => this.setState({username: event.target.value})}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password-input">Password</label>
                                    <input className="input" type="password" name="password" id="password-input" onChange={event => this.setState({password: event.target.value})}/>
                                </div>
                                <input className="btn" type="submit" value="Login"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}