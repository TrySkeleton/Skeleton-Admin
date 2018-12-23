import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'

class Team extends Component {

    constructor(props) {
        super(props)

        this.state = {
            users: [
                {
                    id: 1,
                    name: "bene",
                    lastSeen: new Date()
                }
            ],
            invites: [
                {
                    id: 1,
                    email: 'bene@example.com',
                    sent: new Date()
                }
            ]
        }
    }

    render() {

        const members = this.state.users.map(u => {
            return (
                <Link to={ process.PUBLIC_URL + "/users/" + u.id } className="list-group-item list-group-item-action" key={ u.id }>
                    <div className="row m-0">
                        <div className="col-1 p-0 blog-icon">
                            <img src="https://pbs.twimg.com/profile_images/829287037199069184/lMEGBlYA.jpg"
                                 className="img-fluid rounded-circle" alt="user-icon" />
                        </div>

                        <div className="col-11 account-info">
                            <ul className="align-middle">
                                <li className="blog-title">{ u.name }</li>
                                <li><span className="badge badge-danger">Admin</span> { u.lastSeen.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }</li>
                            </ul>
                        </div>
                    </div>
                </Link>
            )
        })

        const invites = this.state.invites.map(i => {
            return (
                <Link to="/" className="list-group-item list-group-item-action" key={ i.id }>
                    <div className="row m-0">
                        <div className="col-1 p-0 blog-icon">
                            <img src="https://pbs.twimg.com/profile_images/829287037199069184/lMEGBlYA.jpg"
                                 className="img-fluid rounded-circle" alt="user-icon" />
                        </div>

                        <div className="col-11 account-info">
                            <ul className="align-middle">
                                <li className="blog-title">{ i.email }</li>
                                <li>{ i.sent.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }</li>
                            </ul>
                        </div>
                    </div>
                </Link>
            )
        })

        const membersAndInvites = this.state.invites.length === 0 ? (
            <div className="card">
                { members }
            </div>
        ) : (
            <Fragment>
                <h6 className="mt-5 text-secondary">Invites</h6>
                <div className="card">
                    <div className="list-group list-group-flush">
                        { invites }
                    </div>
                </div>

                <h6 className="mt-5 text-secondary">Active members</h6>
                <div className="card">
                    <div className="list-group list-group-flush">
                        { members }
                    </div>
                </div>
            </Fragment>
        )

        return (
            <Fragment>
                <h2 className="d-flex justify-content-between align-items-center">
                    Team
                    <button type="button" className="btn btn-primary">Invite people</button>
                </h2>

                <hr/>

                { membersAndInvites }
            </Fragment>
        )
    }
}

export default Team
