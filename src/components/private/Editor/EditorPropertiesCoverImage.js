import React, {Component, Fragment} from 'react'
import PropTypes from "prop-types"
import {Session} from "../../../Session"
import Net from '../../../connect'
import Article from "./Article"

class EditorPropertiesCoverImage extends Component {

    constructor(props) {

        super(props)

        this.onFileInputChange = this.onFileInputChange.bind(this)
        this.uploadImage = this.uploadImage.bind(this)
        this.pushError = this.pushError.bind(this)

        this.state = {
            isValid: false,
            errors: []
        }

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
                "Authorization": `Bearer ${ this.props.session.token }`
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

            Net.request(this.props.session, "_skeleton", {
                action: "SET_ARTICLE_COVER_URL",
                id: this.props.article.id,
                coverURL: publicUrl
            }).then(() => {
                this.props.article.setCoverURL(publicUrl)
            }).catch(err => {
                this.pushError(err)
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
                <img src={ this.props.article.coverURL } className={ this.props.article.coverURLIsValid ? "img-fluid img-thumbnail mb-2" : "d-none" } />
                { errors }
                <div className="input-group mb-3">
                    <div className="custom-file">
                        <input
                            type="file"
                            accept="image/*"
                            className="custom-file-input"
                            id="skeleton-editor-cover-file-input"
                            onChange={ this.onFileInputChange }
                            ref={ this.imageFileInput } />
                        <label className="custom-file-label" htmlFor="skeleton-editor-cover-file-input">Choose file</label>
                    </div>
                </div>
            </Fragment>
        )
    }
}

EditorPropertiesCoverImage.propTypes = {
    session: PropTypes.instanceOf(Session).isRequired,
    article: PropTypes.instanceOf(Article).isRequired
}

export default EditorPropertiesCoverImage