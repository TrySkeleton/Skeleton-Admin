import React, { Component, Fragment } from 'react'
import {Link} from "react-router-dom";

class Done extends Component {

    render() {

        return (
            <div className="card">
                <div className="card-body">
                    <div className="check_mark mt-5">
                        <div className="sa-icon sa-success animate">
                            <span className="sa-line sa-tip animateSuccessTip"></span>
                            <span className="sa-line sa-long animateSuccessLong"></span>
                            <div className="sa-placeholder"></div>
                            <div className="sa-fix"></div>
                        </div>
                    </div>
                </div>

                { this.props.backURL ? (
                    <div className="col-12 text-center mb-5">
                        <Link to={ this.props.backURL } role="button" className="btn btn-danger">Back</Link>
                    </div>
                ) : null }
            </div>
        )
    }
}

export default Done