import React, { Component, Fragment } from 'react'
import Net from '../../connect'

import Editor, { Article } from './Editor'
import PropTypes from "prop-types";
import {Session} from "../../Session";
import Spinner from "../utils/Spinner";

class ArticleLoader extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            article: {}
        }
    }

    componentDidMount() {

        Net.request('_skeleton', {
            action: "GET_ARTICLE",
            id: this.props.id
        }).then(article => {
            this.setState({
                loading: false,
                article: new Article(article.id, article.title, article.content)
            })
        })
    }

    render() {

        return this.state.loading ? (
            <Spinner />
        ) : (
            <Editor article={ this.state.article } session={ this.props.session } />
        )
    }
}

ArticleLoader.propTypes = {
    id: PropTypes.number.isRequired,
    session: PropTypes.instanceOf(Session).isRequired,
}

export default ArticleLoader