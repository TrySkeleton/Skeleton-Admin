import React, { Component } from 'react'
import NotFound from "./NotFound"
import Search from "./Search"
import Settings from "./Settings"
import Articles from "./Articles"
import { Route, NavLink, Link, Switch, Redirect, withRouter } from 'react-router-dom'
import Team from "./Team"
import PropTypes from 'prop-types'
import Media from '../../media'
import { Session } from '../../Session'
import Events from "./Events"
import errorsStore, { ErrorsView } from "../../Errors"

class Layout extends Component {

    constructor(props) {
        super(props)

        this.onSearchInput = this.onSearchInput.bind(this)
        this.signOut = this.signOut.bind(this)

        this.state = {
            searchInput: ""
        }
    }

    onSearchInput(e) {
        e.preventDefault()

        const value = e.target.value
        this.setState({
            searchInput: value
        })

        if (value === "") {
            this.props.history.push(process.PUBLIC_URL + "/")
            return
        }

        this.props.history.push(process.PUBLIC_URL + "/search?query=" + value)
    }

    signOut() {
        this.props.session.clearSession()
    }

    render() {

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-uw-1 col-lg-2 col-md-3 col-12 p-0 sidebar bg-light">
                        <div className="sidebar-sticky">
                            <div className="row m-0">
                                <div className="col-lg-3 col-12 p-0 blog-icon">
                                    <Link to={ process.PUBLIC_URL + "/" }>
                                        <img src={ Media.Icon } className="rounded-circle img-fluid bg-white img-thumbnail" alt="Skeleton Icon" />
                                    </Link>
                                </div>

                                <div className="col-lg-9 col-12 account-info">
                                    <ul className="align-middle">
                                        <li className="blog-title">Skeleton Admin</li>
                                        <button type="button" className="btn btn-link p-0 border-0" onClick={ this.signOut }>Sign out</button>
                                    </ul>
                                </div>
                            </div>

                            <input type="search" className="my-4 form-control d-none" placeholder="Search" value={ this.state.searchInput } onChange={ this.onSearchInput } />

                            <ul className="nav flex-column mt-4">
                                <li className="nav-item d-none">
                                    <NavLink className="nav-link" to={ process.PUBLIC_URL + "/write/new" }>
                                        New Story
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to={ process.PUBLIC_URL + "/stories" }>
                                        Stories
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to={ process.PUBLIC_URL + "/events" }>
                                        Events
                                    </NavLink>
                                </li>
                            </ul>
                            <h6 className="sidebar-heading d-flex justify-content-between align-items-center mt-4 mb-1 text-muted">
                                <span>Google Services</span>
                            </h6>
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <a className="nav-link" href="http://console.cloud.google.com" target="_blank" rel="noopener noreferrer">
                                        Cloud Platform
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="https://search.google.com/search-console?utm_source=about-page" target="_blank" rel="noopener noreferrer">
                                        SearchConsole
                                    </a>
                                </li>
                            </ul>

                            <div className="col-uw-1 col-lg-2 col-md-3 col-12 text-center fixed-bottom pb-3">
                                <hr />
                                <i className="fas fa-external-link-alt mr-2"></i>
                                <a href="/" target="_blank">View page</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-uw-11 col-lg-10 col-md-9 col-12 ml-sm-auto">
                        <div className="py-5 container">
                            <Switch>
                                <Route exact path={ process.PUBLIC_URL + "/" }>
                                    <Redirect to={ process.PUBLIC_URL + "/stories" }/>
                                </Route>

                                <Route exact path={ process.PUBLIC_URL + "/stories" }>
                                    <Articles session={ this.props.session } />
                                </Route>

                                <Route exact path={ process.PUBLIC_URL + "/team" }>
                                    <Team />
                                </Route>

                                <Route exact path={ process.PUBLIC_URL + "/settings" }>
                                    <Settings />
                                </Route>

                                <Route exact path={ process.PUBLIC_URL + "/search" }>
                                    <Search />
                                </Route>

                                <Route path={ process.PUBLIC_URL + "/events/" }>
                                    <Events session={ this.props.session } />
                                </Route>

                                <Route path={ process.PUBLIC_URL + "/" }>
                                    <NotFound />
                                </Route>
                            </Switch>
                        </div>
                    </div>
                </div>

                <ErrorsView store={ errorsStore } />
            </div>
        )
    }
}

Layout.propTypes = {
    session: PropTypes.instanceOf(Session).isRequired
}

export default withRouter(Layout)
