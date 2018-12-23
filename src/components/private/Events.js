import React, { Component, Fragment } from 'react'
import { Link, Switch, Route } from 'react-router-dom'
import moment from 'moment'

import Connect from '../../connect'
import Spinner from "../utils/Spinner"

class Events extends Component {

    constructor(props) {

        super(props)

        this.onError = this.onError.bind(this)
        this.setPage = this.setPage.bind(this)
        this.fetchEvents = this.fetchEvents.bind(this)

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            articlesCount: 0,
            page: 0,
            events: [],
            loading: true,
            newEvent: {
                name: "",
                startDate: "",
                startTime: "",
                endDate: "",
                endTime: "",
                description: "",
                location: "",
                booth: "",
                googleMapsURL: ""
            }
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

    onChange(e) {

        this.setState({
            newEvent: {
                ...this.state.newEvent,
                [e.target.name]: e.target.value
            }
        })
    }

    onSubmit() {

        const event = this.state.newEvent

        Connect.request('_skeleton', {
            action: 'CREATE_EVENT',
            event
        }).then(payload => {
            this.setState({
                stories: payload,
                loading: false
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
            events = this.state.events.map(p => {
                return (
                    <div className="story card" key={ p.id }>
                        <div className="card-body">
                            <h5>{ p.title }</h5>
                            <footer className="lead">{ p.description ?
                                <p className="lead m-0">{ p.description }</p> :
                                <p className="lead m-0 font-italic">No description</p>
                            }</footer>
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

        let date

        if (this.state.newEvent.startDate && this.state.newEvent.endDate && this.state.newEvent.endDate && this.state.newEvent.endTime) {
            date = `${moment(this.state.newEvent.startDate).format('LL')} ${this.state.newEvent.startTime} - ${moment(this.state.newEvent.endDate).format('LL')} ${this.state.newEvent.endTime}`
        }

        return (
            <Switch>
                <Route exact path={ process.PUBLIC_URL + "/events" }>
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
                </Route>

                <Route path={ process.PUBLIC_URL + "/events/new" }>
                    <Fragment>
                        <h2 className="d-flex justify-content-between align-items-center">
                            New event
                            <Link to={ process.PUBLIC_URL + "/events" } role="button" className="btn btn-danger">Back</Link>
                        </h2>

                        <hr/>

                        <div className="row">
                            <div className="col-6">
                                <div className="form-group">
                                    <label htmlFor="form-new-event-name">Event name <strong>(required)</strong></label>
                                    <input type="text" className="form-control" name="name" id="form-new-event-name" placeholder="Event name" onChange={ this.onChange } value={ this.state.newEvent.name } />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="form-new-event-date-from" className="d-block">Event date <strong>(required)</strong></label>
                                    <input type="date" className="form-control d-inline w-50" name="startDate" id="form-new-event-date-from" placeholder="Event date" onChange={ this.onChange } value={ this.state.newEvent.startDate } />
                                    <input type="date" className="form-control d-inline w-50" name="endDate" id="form-new-event-date-until" placeholder="Event date" onChange={ this.onChange } value={ this.state.newEvent.endDate } />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="form-new-event-time-start" className="d-block">Event time <strong>(required)</strong></label>
                                    <input type="time" className="form-control d-inline w-50" name="startTime" id="form-new-event-time-start" placeholder="Event time" onChange={ this.onChange } value={ this.state.newEvent.startTime } />
                                    <input type="time" className="form-control d-inline w-50" name="endTime" id="form-new-event-time-end" placeholder="Event time" onChange={ this.onChange } value={ this.state.newEvent.endTime } />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="form-new-event-description">Event description</label>
                                    <input type="text" className="form-control" name="description" id="form-new-event-description" placeholder="Event description" onChange={ this.onChange } value={ this.state.newEvent.description } />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="form-new-event-location">Event location</label>
                                    <input type="text" className="form-control" name="location" id="form-new-event-location" placeholder="Event location" onChange={ this.onChange } value={ this.state.newEvent.location } />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="form-new-event-booth">Event booth</label>
                                    <input type="text" className="form-control" name="booth" id="form-new-event-booth" placeholder="Event booth" onChange={ this.onChange } value={ this.state.newEvent.booth } />
                                </div>

                                {/*
                                <div className="form-group">
                                    <label htmlFor="form-new-event-google-maps-link">Google Maps URL</label>
                                    <input type="text" className="form-control" name="googleMapsURL" id="form-new-event-google-maps-link" placeholder="Google Maps URL" onChange={ this.onChange } value={ this.state.newEvent.googleMapsURL } />
                                </div>
                                */}

                                <button type="button" className="btn btn-primary btn-block" onClick={ this.onSubmit } disabled={ !(this.state.newEvent.name && this.state.newEvent.startDate && this.state.newEvent.startTime && this.state.newEvent.endDate && this.state.newEvent.endTime) }>Create event</button>
                            </div>

                            <div className="col-6">
                                <div className="card">
                                    <div className="card-body">
                                        { this.state.newEvent.name ? <h4>{this.state.newEvent.name}</h4> : <h4 className="text-muted">Event name</h4> }
                                        { this.state.newEvent.description ? <p className="lead">{this.state.newEvent.description}</p> : null }
                                        { this.state.newEvent.date ? <p className="card-text"><i className="far fa-clock mr-2"></i>{ date }</p> : <p className="card-text text-muted"><i className="far fa-clock mr-2"></i>{ date }</p> }
                                        { this.state.newEvent.location ? <p className="card-text"><i className="fas fa-location-arrow mr-2"></i>{this.state.newEvent.location}</p> : null }
                                        { this.state.newEvent.booth ? <p className="card-text"><i className="fas fa-map-pin mr-2 ml-1"></i>{this.state.newEvent.booth}</p> : null }
                                        {/*
                                        <iframe
                                            src={ this.state.newEvent.googleMapsURL ? this.state.newEvent.googleMapsURL : "https://www.google.com/maps/embed?pb=" }
                                            height="450" frameBorder="0" allowFullScreen ref={ this.googleMapsFrame } />
                                        */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                </Route>
            </Switch>
        )
    }
}

export default Events
