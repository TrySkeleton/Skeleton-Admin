import React, { Component, Fragment } from 'react'
import { Link, Switch, Route } from 'react-router-dom'
import moment from 'moment'
import Spinner from "../utils/Spinner";
import Connect from "../../connect";
import Done from "../utils/Done";

class EventView extends Component {

    constructor(props) {
        super(props)

        this.onError = this.onError.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.fetchEvent = this.fetchEvent.bind(this)

        this.state = {
            event: {},
            loading: true,
            deleted: false
        }
    }

    componentDidMount() {
        this.fetchEvent(this.props.match.params.eventId)
    }

    fetchEvent(id) {

        Connect.request('_skeleton', {
            action: 'GET_EVENT',
            id
        }).then(payload => {
            console.log(payload)
            this.setState({
                event: payload,
                loading: false
            })
        }).catch(err => this.onError(err))
    }

    onError(err) {
        console.log(err)
    }

    onDelete() {

        this.setState({
            loading: true
        }, () => {

            Connect.request('_skeleton', {
                action: 'DELETE_EVENT',
                id: this.state.event.id
            }).then(payload => {
                this.setState({
                    loading: false,
                    deleted: true
                })
            }).catch(err => this.onError(err))
        })
    }

    render() {

        return (
            <Fragment>
                <h2 className="d-flex justify-content-between align-items-center">
                    { this.state.loading ? "Events" : this.state.event.title }
                    <Link to={ process.PUBLIC_URL + "/events" } role="button" className="btn btn-danger">Back</Link>
                </h2>

                <hr/>

                { this.state.loading ? (
                    <Spinner/>
                ) : !this.state.deleted ? (
                    <div className="btn-group-vertical">
                        <button type="button" className="btn btn-secondary">Edit</button>
                        <button type="button" className="btn btn-secondary">Duplicate</button>
                        <button type="button" className="btn btn-secondary" onClick={ this.onDelete }>Delete</button>
                    </div>
                ) : (
                    <Done backURL={ process.PUBLIC_URL + "/events" }/>
                )}
            </Fragment>
        )
    }
}

export default EventView