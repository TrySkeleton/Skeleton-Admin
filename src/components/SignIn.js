import './SignIn.css'
import PropTypes from "prop-types"
import Media from '../media'

import React, { Component } from 'react'
import {Session} from "../Session"
import Spinner from './utils/Spinner'

class SignIn extends Component {

    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            email: "",
            password: "",
            errorMessage: "",
            loading: false
        }
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault()

        this.setState({
            loading: true
        })

        const requestTimeout = setTimeout(() => {
            this.setState({
                loading: false,
                errorMessage: "Request timeout"
            })
        }, 10000)

        const { password, email } = this.state

        fetch('/skeleton/api/v1/auth', {
            method: 'POST',
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                username: email,
                password
            })
        }).then(res => res.json()).then(data => {

            if (data.type === "ERROR") {
                this.setState({
                    loading: false,
                    errorMessage: data.error.message || "Unknown error"
                })
                return
            }

            const { token } = data

            this.props.session.authenticated = true
            this.props.session.token = token

        }).catch(err => {
            this.setState({
                loading: false,
                errorMessage: err.message || "Unknown connect error"
            })
        }).finally(() => {
            clearTimeout(requestTimeout)
        })
    }

    render() {

        const content = this.state.loading ? (
            <Spinner/>
        ) : (
            <form onSubmit={ this.onSubmit }>
                <div className="input-group mb-1">
                    <input
                        name="email"
                        type="email"
                        className={ this.state.errorMessage ? "form-control rounded-right is-invalid" : "form-control rounded-right" }
                        placeholder="Email Address"
                        required
                        autoFocus
                        onChange={ this.onChange }
                        value={ this.state.email } />
                </div>

                <div className="input-group mb-3">
                    <input
                        name="password"
                        type="password"
                        className={ this.state.errorMessage ? "form-control rounded-right is-invalid" : "form-control rounded-right" }
                        placeholder="Password"
                        required
                        autoFocus
                        minLength="6"
                        onChange={ this.onChange }
                        value={ this.state.password } />
                    <div className="invalid-feedback text-center">
                        { this.state.errorMessage }
                    </div>
                </div>

                <button type="submit" className="btn btn-secondary text-center btn-block">Enter now</button>
            </form>
        )

        return (
            <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="col-12 col-md-5">
                        <h1 className="text-center mb-5 font-weight-light">This site is private</h1>

                        <div className="card shadow-sm bg-light">
                            <div className="card-body p-5">

                                <img src={ Media.Icon } className="w-50 h-auto rounded-circle img-thumbnail mb-5 mx-auto d-block" alt="Brand" />

                                { content }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

SignIn.propTypes = {
    session: PropTypes.instanceOf(Session).isRequired
}

export default SignIn
