import React, { Component } from 'react'
import PropTypes from "prop-types"
import {Session} from "../../../Session"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Net from '../../../connect'
import EditorPropertiesCoverImage from "./EditorPropertiesCoverImage"

class EditorProperties extends Component {

    constructor(props) {

        super(props)

        this.setPublishState = this.setPublishState.bind(this)
        this.pushError = this.pushError.bind(this)

        this.state = {
            isPublished: this.props.isPublished,
            errors: []
        }
    }

    componentDidMount() {

    }

    pushError(err) {
        this.setState(prevState => ({
            errors: [...prevState.errors, err]
        }))
    }

    setPublishState(publish) {

        Net.request(this.props.session, '_skeleton', {
            action: "SET_ARTICLE_PUBLISH_STATE",
            id: this.props.id,
            publish: publish
        }).then((res) => {
            this.setState({
                isPublished: publish
            })
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
                <ModalHeader toggle={ this.props.onToggle }>{ this.props.title }</ModalHeader>
                <ModalBody>
                    { errors }
                    <div className="form-group">
                        <label>Cover image (4:3)</label>
                        <EditorPropertiesCoverImage
                            id={ this.props.id }
                            session={ this.props.session }
                            coverURL={ this.props.coverURL }
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    { !this.state.isPublished ? (
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
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    coverURL: PropTypes.string.isRequired,
    display: PropTypes.bool.isRequired,
    isPublished: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired
}

export default EditorProperties