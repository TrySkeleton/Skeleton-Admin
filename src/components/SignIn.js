import './SignIn.css'
import PropTypes from "prop-types"
import Media from '../media'
import Net from '../connect'

import React, { Component } from 'react'
import {Session} from "../Session"
import Spinner from './utils/Spinner'

class SignIn extends Component {

    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            password: "",
            errorMessage: "",
            loading: false
        }
    }

    onChange(e) {
        this.setState({
            password: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault()

        this.setState({
            loading: true
        })

        const password = this.state.password
        const requestTimeout = setTimeout(() => {
            this.setState({
                loading: false,
                errorMessage: "Request timeout"
            })
        }, 10000)

        Net.request('_skeleton', {
            action: 'AUTH_WITH_ACCESS_PASSWORD',
            password
        }).then(token => {
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
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="lock-icon"><i className="fas fa-lock"></i></span>
                    </div>
                    <input type="password" className={ this.state.errorMessage ? "form-control rounded-right is-invalid" : "form-control rounded-right" } placeholder="Password" aria-label="Password" aria-describedby="lock-icon" required minLength="6" onChange={ this.onChange } value={ this.state.password } autoFocus />
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
