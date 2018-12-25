import React, { Component, Fragment } from 'react'
import {Link} from "react-router-dom";
import moment from "moment";
import Connect from "../../connect";
import Done from "../utils/Done";

class EventsNew extends Component {

    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onValidate = this.onValidate.bind(this)

        this.state = {
            isValid: false,
            submitted: false,
            newEvent: {
                title: "",
                start: "",
                end: "",
                description: "",
                location: "",
                booth: ""
            }
        }
    }

    onChange(e) {

        this.setState({
            newEvent: {
                ...this.state.newEvent,
                [e.target.name]: e.target.value
            }
        }, () => {
            this.onValidate()
        })
    }

    onSubmit() {

        const event = this.state.newEvent

        Connect.request('_skeleton', {
            action: 'CREATE_EVENT',
            event
        }).then(payload => {
            this.setState({
                submitted: true
            })
        }).catch(err => {
            console.log(err)
            console.log(err.message)
        })
    }

    onValidate() {

        let isValid = true

        if (typeof this.state.newEvent.title !== "string" || this.state.newEvent.title.length < 3) {
            isValid = false
        }

        const start = moment(this.state.newEvent.start)
        if (isValid && !start.isValid()) {
            isValid = false
        }

        const end = moment(this.state.newEvent.end)
        if (isValid && (!end.isValid() || end.isBefore(start))) {
            isValid = false
        }

        this.setState({
            isValid
        })
    }

    render() {

        let date = null

        if (this.state.newEvent.start && this.state.newEvent.end) {
            date = `${moment(this.state.newEvent.start).format('ll')} - ${moment(this.state.newEvent.end).format('ll')}`
        }

        const view = !this.state.submitted ? (
            <div className="row">
                <div className="col-6">
                    <div className="form-group">
                        <label htmlFor="form-new-event-title">Event title <strong>(required)</strong></label>
                        <input type="text" className="form-control" name="title" id="form-new-event-title" placeholder="Event title" onChange={ this.onChange } value={ this.state.newEvent.title } />
                    </div>

                    <div className="form-group event-date-picker">
                        <label htmlFor="form-new-event-date-from" className="d-block">Event date <strong>(required)</strong></label>
                        <input type="date" className="form-control d-inline w-50" name="start" id="form-new-event-date-from" placeholder="Event start" onChange={ this.onChange } value={ this.state.newEvent.start } />
                        <input type="date" className="form-control d-inline w-50" name="end" id="form-new-event-date-until" placeholder="Event end" onChange={ this.onChange } value={ this.state.newEvent.end } />
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

                    <button type="button" className="btn btn-primary btn-block" onClick={ this.onSubmit } disabled={ !this.state.isValid }>Create event</button>
                </div>

                <div className="col-6">
                    <div className="card">
                        <div className="card-body">
                            { this.state.newEvent.title ? <h4>{this.state.newEvent.title}</h4> : <h4 className="text-muted">Event title</h4> }
                            { this.state.newEvent.description ? <p className="lead">{this.state.newEvent.description}</p> : null }
                            { date ? <p className="card-text"><i className="far fa-clock mr-2"></i>{ date }</p> : <p className="card-text text-muted"><i className="far fa-clock mr-2"></i>Event date</p> }
                            { this.state.newEvent.location ? <p className="card-text"><i className="fas fa-location-arrow mr-2"></i>{this.state.newEvent.location}</p> : null }
                            { this.state.newEvent.booth ? <p className="card-text"><i className="fas fa-map-pin mr-2 ml-1"></i>{this.state.newEvent.booth}</p> : null }
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <Done backURL={ process.PUBLIC_URL + "/events" }/>
        )

        return (
            <Fragment>
                <h2 className="d-flex justify-content-between align-items-center">
                    New event
                    <Link to={ process.PUBLIC_URL + "/events" } role="button" className="btn btn-danger">Back</Link>
                </h2>

                <hr/>

                { view }
            </Fragment>
        )
    }
}

export default EventsNew