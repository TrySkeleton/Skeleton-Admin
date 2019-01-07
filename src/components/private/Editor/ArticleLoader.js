import React, { Component } from 'react'
import Net from '../../../connect'

import Editor from './Editor'
import PropTypes from "prop-types";
import {Session} from "../../../Session";
import Spinner from "../../utils/Spinner";

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
        }).then(article => {
            this.setState({
                loading: false,
                article: {
                    id: article.id,
                    title: article.title,
                    content: article.content,
                    coverURL: article.cover_image_url || "",
                    isPublished: typeof article.published_at === 'string' && article.published_at.length > 1
                }
            })
        })
    }

    render() {

        return this.state.loading ? (
            <Spinner />
        ) : (
            <Editor
                id={ this.state.article.id }
                title={ this.state.article.title }
                content={ this.state.article.content }
                coverURL={ this.state.article.coverURL }
                isPublished={ this.state.article.isPublished }
                session={ this.props.session } />
        )
    }
}

ArticleLoader.propTypes = {
    id: PropTypes.number.isRequired,
    session: PropTypes.instanceOf(Session).isRequired,
}

export default ArticleLoader