import React, { Component } from 'react'
import {Redirect} from "react-router-dom"

import Net from '../../connect'

class NewStoryLoading extends Component {

    constructor(props) {
        super(props)

        this.state = {
            newStoryId: ""
        }
    }

    componentDidMount() {

        Net.request('_skeleton', {
            action: "CREATE_NEW_ARTICLE"
        }).then(storyId => {
            this.setState({
                newStoryId: storyId
            })
        })
        .catch(err => {

        })
    }

    render() {

        return this.state.newStoryId === "" ? (
            <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </div>
        ) : <Redirect to={ `${process.PUBLIC_URL}/write/${ this.state.newStoryId }`} />
    }
}

export default NewStoryLoading
