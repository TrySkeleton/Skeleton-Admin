import React, { Component, Fragment } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import PropTypes from "prop-types"
import {Session} from "../../../Session"

class EditorImageUploader extends Component {

    constructor(props) {
        super(props)

        this.state = {
            imageURL: "",
            showModal: true,
            isValid: false,
            errors: []
        }

        this.onFileInputChange = this.onFileInputChange.bind(this)
        this.uploadImage = this.uploadImage.bind(this)
        this.pushError = this.pushError.bind(this)

        this.imageFileInput = React.createRef()
    }

    onFileInputChange() {
        if (this.imageFileInput.current.files[0]) {
            this.uploadImage(this.imageFileInput.current.files[0])
        }
    }

    pushError(err) {
        this.setState(prevState => ({
            errors: [...prevState.errors, err]
        }))
    }

    uploadImage(imageFile) {

        const formData = new FormData()
        formData.append('image', imageFile)

        fetch('/skeleton/api/v1/upload', {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Authorization": `Bearer ${this.props.session.token}`
            },
            body: formData
        }).then(res => {

            const status = res.status

            if (status === 401) {
                this.pushError(new Error("Unauthorized"))
                return
            }

            return res.json()
        }).then(data => {

            const publicUrl = data.publicUrl

            if (typeof publicUrl !== "string" || publicUrl.length < 1) {
                this.pushError(new Error("Unknown error"))
                return
            }

            this.setState({
                imageURL: publicUrl,
                isValid: true
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
            <Fragment>
                <Modal isOpen={ this.props.display } toggle={ this.props.onToggle } centered={ true }>
                    <ModalHeader toggle={ this.props.onToggle }>Insert an image</ModalHeader>
                    <ModalBody>
                        { errors }
                        <div className="input-group border-0">
                            <div className="custom-file">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="custom-file-input border-top-0"
                                    onChange={ this.onFileInputChange }
                                    ref={ this.imageFileInput } />

                                <label className="custom-file-label">Choose file</label>
                            </div>
                        </div>

                        { this.state.isValid ? (
                            <Fragment>
                                <hr />
                                <img src={ this.state.imageURL } className="img-fluid img-thumbnail" alt="Preview" />
                            </Fragment>
                        ): null }
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            onClick={ () => {
                                this.props.onInsert(this.state.imageURL)
                                this.props.onToggle()
                            }}
                            disabled={ !this.state.isValid }>Insert</Button>{' '}
                        <Button color="secondary" onClick={ this.props.onToggle }>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </Fragment>
        )
    }
}

EditorImageUploader.propTypes = {
    session: PropTypes.instanceOf(Session).isRequired,
    onInsert: PropTypes.func.isRequired,
    display: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
}

export default EditorImageUploader