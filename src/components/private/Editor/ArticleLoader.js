import React, { Component } from 'react'
import Net from '../../../connect'

import Editor from './Editor'
import PropTypes from "prop-types";
import {Session} from "../../../Session";
import Spinner from "../../utils/Spinner";
import Article from "./Article"

class ArticleLoader extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            article: {}
        }
    }

    componentDidMount() {

        Net.request(this.props.session,'_skeleton', {
            action: "GET_ARTICLE",
            id: this.props.id
        }).then(a => {

            const article = new Article()
            article.setArticle(a.id, a.title, a.content, a["cover_image_url"], a.coverURL, typeof a["published_at"] === 'string' && a["published_at"].length > 1)

            this.setState({
                loading: false,
                article
            })
        })
    }

    render() {

        return this.state.loading ? (
            <Spinner />
        ) : (
            <Editor
                article={ this.state.article }
                session={ this.props.session } />
        )
    }
}

ArticleLoader.propTypes = {
    id: PropTypes.number.isRequired,
    session: PropTypes.instanceOf(Session).isRequired,
}

export default ArticleLoader