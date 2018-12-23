import React, { Fragment, Component } from 'react'

class NotFound extends Component {

    render() {

        return (
            <Fragment>
                <h2 className="d-flex justify-content-between align-items-center">
                    Not found
                    <button type="button" className="btn btn-primary">Back</button>
                </h2>

                <hr/>
            </Fragment>
        )
    }
}

export default NotFound
