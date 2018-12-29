import React, {Component} from 'react'
import Media from "../media";

class DatabaseSetup extends Component {

    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            host: "",
            database: "",
            username: "",
            password: "",
        }
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault()
    }

    render() {

        return (
            <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="col-6">
                        <div className="card">
                            <div className="card-body">
                                <img src={ Media.Icon } className="w-25 h-auto rounded-circle img-thumbnail my-5 mx-auto d-block" alt="Brand" />
                                <h2 className="text-center">Step 1: Database</h2>
                                <hr/>
                                <form onSubmit={ this.onSubmit }>
                                    <div className="form-group">
                                        <label htmlFor="setup-input-db-host">Host</label>
                                        <input
                                            name="host"
                                            type="text"
                                            id="setup-input-db-host"
                                            className="form-control"
                                            placeholder="Host"
                                            onChange={ this.onChange }
                                            value={ this.state.host } />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="setup-input-db-name">Database</label>
                                        <input
                                            name="database"
                                            type="text"
                                            id="setup-input-db-name"
                                            className="form-control"
                                            placeholder="Database"
                                            onChange={ this.onChange }
                                            value={ this.state.database } />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="setup-input-db-username">Username</label>
                                        <input
                                            name="username"
                                            type="text"
                                            id="setup-input-db-username"
                                            className="form-control"
                                            placeholder="Username"
                                            onChange={ this.onChange }
                                            value={ this.state.username } />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="setup-input-db-password">Password</label>
                                        <input
                                            name="password"
                                            type="password"
                                            id="setup-input-db-password"
                                            className="form-control"
                                            placeholder="Password"
                                            onChange={ this.onChange }
                                            value={ this.state.password } />
                                    </div>

                                    <button type="submit" className="btn btn-secondary btn-block">Continue</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class AuthenticationSetup extends Component {

    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            username: "",
            password: "",
        }
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault()
    }

    render() {

        return (
            <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="col-6">
                        <div className="card">
                            <div className="card-body">
                                <h1 className="text-center">Step 2: Authentication</h1>
                                <hr/>
                                <form onSubmit={ this.onSubmit }>
                                    <div className="form-group">
                                        <label htmlFor="setup-input-db-username">Username</label>
                                        <input
                                            name="username"
                                            type="text"
                                            id="setup-input-db-username"
                                            className="form-control"
                                            placeholder="Username"
                                            onChange={ this.onChange }
                                            value={ this.state.username } />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="setup-input-db-password">Password</label>
                                        <input
                                            name="password"
                                            type="password"
                                            id="setup-input-db-password"
                                            className="form-control"
                                            placeholder="Password"
                                            onChange={ this.onChange }
                                            value={ this.state.password } />
                                    </div>

                                    <button type="submit" className="btn btn-secondary btn-block">Continue</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class Setup extends Component {

    constructor(props) {
        super(props)

        this.steps = [
            <DatabaseSetup/>,
            <AuthenticationSetup/>
        ]

        this.state = {
            step: 0
        }
    }

    render() {
        return this.steps[this.state.step]
    }
}

export default Setup