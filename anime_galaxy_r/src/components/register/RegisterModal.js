import ModalWindow from './../modalwindow/ModalWindow';
import {ToastsStore} from "react-toasts";
import React from "react";
import * as ReactDOM from "react-dom";

export default class RegisterModal extends ModalWindow {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            confirmPassword: "",
            email: ""
        };
    }

    handleSubmit = event => {
        event.preventDefault();
        if (this.state.password !== this.state.confirmPassword) {
            let this_el = ReactDOM.findDOMNode(this);

            if (this_el instanceof HTMLElement) {
                this_el.querySelector("#register-confirm-password-input ~ .invalid-form-msg").innerHTML = "As passwords não coincidem";
                this_el.querySelector("#register-confirm-password-input").parentElement.classList.add("invalid");
                return;
            }
        }

        this.props.register(this.state.username, this.state.password).then(res => {
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
                        <h1 className="title"><span>Registar</span></h1>
                    </header>
                    <form className="login-form w-100" action="" onSubmit={this.handleSubmit}>
                        <div className="modal-body">
                            <div className="login-container">
                                <div className="form-group">
                                    <label htmlFor="register-username-input">Username</label>
                                    <input className="input" spellCheck="false" type="text" name="username" id="register-username-input" onChange={event => this.setState({username: event.target.value})}/>
                                    <sub className="invalid-form-msg">Algo de errado não está certo aqui</sub>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="register-password-input">Password</label>
                                    <input className="input" type="password" name="password" id="register-password-input" onChange={event => this.setState({password: event.target.value})}/>
                                    <sub className="invalid-form-msg">Algo de errado não está certo aqui</sub>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="register-confirm-password-input">Confirmar Password</label>
                                    <input className="input" type="password" name="confirm-password" id="register-confirm-password-input" onChange={event => this.setState({confirmPassword: event.target.value})}/>
                                    <sub className="invalid-form-msg">Algo de errado não está certo aqui</sub>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="register-email-input">Email</label>
                                    <input className="input" type="email" name="email" id="register-email-input" onChange={event => this.setState({email: event.target.value})}/>
                                    <sub className="invalid-form-msg">Algo de errado não está certo aqui</sub>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <input className="btn" type="submit" value="Registar"/>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

};