import React, { Component, Fragment } from 'react'
import { Link, Switch, Route } from 'react-router-dom'
import moment from 'moment'

import Connect from '../../connect'
import Spinner from "../utils/Spinner"
import EventsNew from "./EventsNew";
import PropTypes from "prop-types"
import {Session} from "../../Session"

class EventsView extends Component {

    constructor(props) {

        super(props)

        this.onDelete = this.onDelete.bind(this)
        this.onError = this.onError.bind(this)
        this.setPage = this.setPage.bind(this)
        this.fetchEvents = this.fetchEvents.bind(this)

        this.state = {
            articlesCount: 0,
            page: 0,
            events: [],
            loading: true,

        }
    }

    componentDidMount() {
        this.fetchEvents()
    }

    fetchEvents() {

        Connect.request(this.props.session, '_skeleton', {
            action: 'GET_EVENTS_COUNT'
        }).then(payload => {
            this.setState({
                eventsCount: payload
            })

            Connect.request(this.props.session, '_skeleton', {
                action: 'GET_EVENTS',
                limit: 10,
                offset: this.state.page * 10
            }).then(payload => {
                this.setState({
                    events: payload,
                    loading: false
                })
            }).catch(err => this.onError(err))
        }).catch(err => this.onError(err))
    }

    onError(err) {

    }

    setPage(page, event) {

        if (event) {
            event.preventDefault()
        }

        const pages = Math.ceil(this.state.articlesCount / 10)

        if (page < 0) {
            page = 0
        }

        if (page > pages) {
            page = pages
        }

        this.setState({
            page
        }, () => {
            this.fetchArticles()
        })
    }

    onDelete(id, target) {

        target.disabled = true

        if (!window.confirm("Do you really want to delete this event?")) {
            return
        }

        Connect.request(this.props.session, "_skeleton", {
            action: "DELETE_EVENT",
            id
        }).then(() => {

            const events = this.state.events.filter(e => e.id !== id)

            this.setState({
                events
            })
        }).catch(err => {

        })
    }

    render() {

        let events = (
            <div className="blankslate card">
                <h3>No events</h3>
            </div>
        )

        if (this.state.events.length >= 1) {
            events = this.state.events.map(event => {
                return (
                    <div className="event card" key={ event.id }>
                        <div className="card-body">
                            <h5>{ event.title }</h5>
                            { event.description ?
                                <p className="lead">{ event.description }</p> :
                                <p className="lead font-italic">No description</p>
                            }

                            <table>
                                <tbody>
                                    <tr>
                                        <td><p className="m-0 text-center pr-2"><i className="far fa-clock"></i></p></td>
                                        <td>
                                            <p className="m-0">
                                            {
                                                moment(event.start).format("LL")
                                            } - {
                                                moment(event.end).format("LL")
                                            }
                                            </p>
                                        </td>
                                    </tr>
                                    { event.location  ? (
                                        <tr>
                                            <td><p className="m-0 text-center pr-2"><i className="fas fa-location-arrow"></i>
                                            </p></td>
                                            <td><p className="m-0">{ event.location }</p></td>
                                        </tr>
                                    ) : null}

                                    { event.booth ? (
                                        <tr>
                                            <td><p className="m-0 text-center pr-2"><i className="fas fa-map-pin"></i></p></td>
                                            <td><p className="m-0">{ event.booth }</p></td>
                                        </tr>
                                    ) : null }
                                </tbody>
                            </table>
                        </div>
                        <div className="card-footer p-1">
                            <button
                                type="button"
                                className="btn btn-danger btn-sm float-right"
                                onClick={ (e) => this.onDelete(event.id, e.target) }>
                                Delete
                            </button>
                        </div>
                    </div>
                )
            })
        }

        const pages = Array.from(Array(Math.ceil(this.state.articlesCount / 10)).keys())

        const pagination = pages.length >= 2 ? (
            <nav aria-label="Articles pagination">
                <ul className="pagination justify-content-center mt-3">
                    <li className="page-item">
                        <button type="button" className="page-link" onClick={ (e) => this.setPage(this.state.page - 1, e) } aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                            <span className="sr-only">Previous</span>
                        </button>
                    </li>
                    {
                        pages.map((page) => (
                            <li className={ `page-item${ this.state.page === page ? ' active' : ''}`} key={ `articles-page-${page}` }>
                                <button type="button" className="page-link" onClick={ (e) => this.setPage(page, e) }>{ page + 1 }</button>
                            </li>
                        ))
                    }
                    <li className="page-item">
                        <button type="button" className="page-link" onClick={ (e) => this.setPage(this.state.page + 1, e) } aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                            <span className="sr-only">Next</span>
                        </button>
                    </li>
                </ul>
            </nav>
        ) : null

        return (
            <Fragment>
                <h2 className="d-flex justify-content-between align-items-center">
                    Events
                    <Link to={ process.PUBLIC_URL + "/events/new" } role="button" className="btn btn-primary">New event</Link>
                </h2>

                <hr/>

                { this.state.loading ? <Spinner/> : (
                    <Fragment>
                        { events }
                        { pagination }
                    </Fragment>
                )}
            </Fragment>
        )
    }
}

EventsView.propTypes = {
    session: PropTypes.instanceOf(Session).isRequired
}

class Events extends Component {

    render() {

        return (
            <Switch>
                <Route exact path={ process.PUBLIC_URL + "/events" }>
                    <EventsView session={ this.props.session } />
                </Route>

                <Route exact path={ process.PUBLIC_URL + "/events/new" }>
                    <EventsNew session={ this.props.session }/>
                </Route>
            </Switch>
        )
    }
}

Events.propTypes = {
    session: PropTypes.instanceOf(Session).isRequired
}

export default Events
