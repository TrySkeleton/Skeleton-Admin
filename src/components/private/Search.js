import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'

class Search extends Component {

    render() {

        // const query = queryString.parse(this.props.location.search).query

        return (
            <Fragment>
                <h2 className="d-flex justify-content-between align-items-center">
                    Search
                </h2>

                <hr/>

                <div className="blankslate card">
                    <h3>No results</h3>
                </div>
            </Fragment>
        )
    }
}

export default withRouter(Search)
