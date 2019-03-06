import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'

import Connect from '../../connect'
import Spinner from "../utils/Spinner"
import PropTypes from "prop-types"
import {Session} from "../../Session"

class Articles extends Component {

    constructor(props) {

        super(props)

        this.onError = this.onError.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.setPage = this.setPage.bind(this)
        this.fetchArticles = this.fetchArticles.bind(this)

        this.state = {
            articlesCount: 0,
            page: 0,
            articles: [],
            loading: true
        }
    }

    componentDidMount() {
        this.fetchArticles()
    }

    fetchArticles() {

        Connect.request(this.props.session, '_skeleton', {
            action: 'GET_ARTICLES_COUNT'
        }).then(payload => {
            this.setState({
                articlesCount: payload
            })

            Connect.request(this.props.session, '_skeleton', {
                action: 'GET_ARTICLES',
                limit: 10,
                offset: this.state.page * 10
            }).then(payload => {
                this.setState({
                    articles: payload,
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
            page,
            loading: true
        }, () => {
            this.fetchArticles()
        })
    }

    onDelete(id, target) {

        target.disabled = true

        if (!window.confirm("Do you really want to delete this article?")) {
            target.disabled = false
            return
        }

        Connect.request(this.props.session, "_skeleton", {
            action: "DELETE_ARTICLE",
            id
        }).then(() => {

            const articles = this.state.articles.filter(e => e.id !== id)

            this.setState({
                articles
            })
        }).catch(err => {
            this.onError(err)
        })
    }

    render() {

        let articles = (
            <div className="blankslate card">
                <h3>No articles</h3>
            </div>
        )

        if (this.state.articles.length >= 1) {
            articles = this.state.articles.map(article => {
                return (
                    <div className="story card" key={ article.id }>
                        <Link to={ `${process.PUBLIC_URL}/write/${article.id}`} className="card-body">
                            <h5>{ article.title } { article["published_at"] ?
                                <span className="badge badge-success">Published</span> :
                                <span className="badge badge-danger">Draft</span>}
                            </h5>
                            { article.preview ?
                                <p className="lead m-0">{ article.preview }</p> :
                                <p className="lead m-0 font-italic">This document is empty</p>
                            }
                        </Link>
                        <div className="card-footer p-1">
                            <button
                                type="button"
                                className="btn btn-danger btn-sm float-right"
                                onClick={ (e) => this.onDelete(article.id, e.target) }>
                                Delete
                            </button>
                        </div>
                    </div>
                )
            })
        }

        const pages = Array.from(Array(Math.ceil(this.state.articlesCount / 10)).keys())

        const pagination = pages.length > 1 ? (
            <nav aria-label="Articles pagination">
                <ul className="pagination justify-content-center mt-3">
                    {
                        this.state.page !== 0 ? (
                            <li className="page-item">
                                <button type="button" className="page-link" onClick={ (e) => this.setPage(this.state.page - 1, e) } aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                    <span className="sr-only">Previous</span>
                                </button>
                            </li>
                        ) : null
                    }
                    {
                        pages.map((page) => (
                            <li className={ `page-item${ this.state.page === page ? ' active' : ''}`} key={ `articles-page-${page}` }>
                                <button type="button" className="page-link" onClick={ (e) => this.setPage(page, e) }>{ page + 1 }</button>
                            </li>
                        ))
                    }
                    {
                        this.state.page !== pages.length -1 ? (
                            <li className="page-item">
                                <button type="button" className="page-link" onClick={ (e) => this.setPage(this.state.page + 1, e) } aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                    <span className="sr-only">Next</span>
                                </button>
                            </li>
                        ) : null
                    }
                </ul>
            </nav>
        ) : null

        return (
            <Fragment>
                <h2 className="d-flex justify-content-between align-items-center">
                    Stories
                    <Link to={ process.PUBLIC_URL + "/write/new"} role="button" className="btn btn-primary">New story</Link>
                </h2>

                <hr/>

                { this.state.loading ? <Spinner/> : (
                    <Fragment>
                        { articles }
                        { pagination }
                    </Fragment>
                )}
            </Fragment>
        )
    }
}

Articles.propTypes = {
    session: PropTypes.instanceOf(Session).isRequired
}

export default Articles
