import React, { Component, Fragment } from 'react'

class Settings extends Component {

    render() {

        return (
            <Fragment>
                <h2 className="d-flex justify-content-between align-items-center">
                    Settings
                    <button type="button" className="btn btn-primary disabled">Save</button>
                </h2>

                <hr/>

                <div className="blankslate card">
                    <h3>No settings</h3>
                </div>
            </Fragment>
        )
    }
}

export default Settings
