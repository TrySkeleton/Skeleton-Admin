import React, { Component } from 'react'
import PropTypes from "prop-types"
import {Session} from "../../../Session"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Net from '../../../connect'
import EditorPropertiesCoverImage from "./EditorPropertiesCoverImage"
import Article from "./Article"

class EditorProperties extends Component {

    constructor(props) {

        super(props)

        this.setPublishState = this.setPublishState.bind(this)
        this.pushError = this.pushError.bind(this)

        this.state = {
            errors: []
        }
    }

    pushError(err) {
        this.setState(prevState => ({
            errors: [...prevState.errors, err]
        }))
    }

    setPublishState(value) {

        if (!this.props.article.coverURLIsValid) {
            this.pushError(new Error("Invalid cover image"))
            return
        }

        Net.request(this.props.session, '_skeleton', {
            action: "SET_ARTICLE_PUBLISH_STATE",
            id: this.props.id,
            publish: !!value
        }).then((res) => {
            this.props.article.setPublished(!!value)
        }).catch(err => {
            this.pushError(err)
        })
    }

    render() {

        const errors = this.state.errors.map(err => (
            <div className="alert alert-danger" role="alert">
                { err.message }
            </div>
        ))

        return (
            <Modal isOpen={ this.props.display } toggle={ this.props.onToggle } centered={ true }>
                <ModalHeader toggle={ this.props.onToggle }>{ this.props.article.title }</ModalHeader>
                <ModalBody>
                    { errors }
                    <div className="form-group">
                        <label>Cover image (4:3)</label>
                        <EditorPropertiesCoverImage
                            session={ this.props.session }
                            article={ this.props.article }
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    { !this.props.article.isPublished ? (
                        <Button color="success" onClick={ () => this.setPublishState(true) }>Publish</Button>
                    ) : (
                        <Button color="danger" onClick={ () => this.setPublishState(false) }>Unplublish</Button>
                    )}
                    {' '}
                    <Button color="secondary" onClick={ this.props.onToggle }>Close</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

EditorProperties.propTypes = {
    session: PropTypes.instanceOf(Session).isRequired,
    article: PropTypes.instanceOf(Article).isRequired
}

export default EditorProperties