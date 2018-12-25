import React, { Component, Fragment } from 'react'
import { Link, Switch, Route } from 'react-router-dom'
import moment from 'moment'

import Connect from '../../connect'
import Spinner from "../utils/Spinner"
import EventsNew from "./EventsNew";
import EventView from "./EventView";

class EventsView extends Component {

    constructor(props) {

        super(props)

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

        Connect.request('_skeleton', {
            action: 'GET_EVENTS_COUNT'
        }).then(payload => {
            this.setState({
                eventsCount: payload
            })

            Connect.request('_skeleton', {
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

    render() {

        let events = (
            <div className="blankslate card">
                <h3>No events</h3>
            </div>
        )

        if (this.state.events.length >= 1) {
            events = this.state.events.map(p => {
                return (
                    <Link to={ `${process.PUBLIC_URL}/events/${p.id}`} className="event card" key={ p.id }>
                        <div className="card-body">
                            <h5>{ p.title }</h5>
                            <footer className="lead">{ p.description ?
                                <p className="lead m-0">{ p.description }</p> :
                                <p className="lead m-0 font-italic">No description</p>
                            }</footer>
                        </div>
                    </Link>
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

class Events extends Component {

    render() {

        return (
            <Switch>
                <Route exact path={ process.PUBLIC_URL + "/events" }>
                    <EventsView/>
                </Route>

                <Route exact path={ process.PUBLIC_URL + "/events/new" }>
                    <EventsNew/>
                </Route>

                <Route exact path={ process.PUBLIC_URL + "/events/:eventId" } component={ EventView }/>
            </Switch>
        )
    }
}

export default Events
