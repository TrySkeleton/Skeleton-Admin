import './Editor.css'
import PropTypes from "prop-types"

import React, {Component, Fragment} from 'react'
import { Link } from 'react-router-dom'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Session } from '../../Session'

import imagePlaceholder from '../../media/image-placeholder.jpg'

class Editor extends Component {

    constructor(props) {

        super(props)

        this.state = {
            status: 'New',
            words: 0,
            post: {
                title: ''
            },
            showImageInsertModal: false,
            showInsertButton: false,
            showTools: false
        }

        this.onTitleChange = this.onTitleChange.bind(this)
        this.onSectionBlur = this.onSectionBlur.bind(this)
        this.onSectionHover = this.onSectionHover.bind(this)
        this.onSectionFocus = this.onSectionFocus.bind(this)
        this.onBackspace = this.onBackspace.bind(this)
        this.execCommand = this.execCommand.bind(this)
        this.onEnter = this.onEnter.bind(this)
        this.onKeyUp = this.onKeyUp.bind(this)
        this.toggleImageInsertModal = this.toggleImageInsertModal.bind(this)
        this.onLoadImage = this.onLoadImage.bind(this)
        this.insertSection = this.insertSection.bind(this)
        this.insertImage = this.insertImage.bind(this)
        this.updateTools = this.updateTools.bind(this)

        this.insertButton = React.createRef()
        this.tools = React.createRef()
        this.content = React.createRef()
        this.heading = React.createRef()
        this.insertImagePreview = React.createRef()
        this.focusedSection = React.createRef()
    }

    componentDidMount() {
        document.addEventListener("selectionchange", this.updateTools)
        window.addEventListener("resize", this.updateTools)
    }

    componentWillUnmount() {
        document.removeEventListener("selectionchange", this.updateTools)
        window.removeEventListener("resize", this.updateTools)
    }

    onLoadImage(e) {

        const file = e.target.files[0]
        const reader = new FileReader()

        reader.onloadend = () => {

            const imageData = reader.result
            this.insertImagePreview.current.setAttribute('src', imageData)
        }
        reader.readAsDataURL(file)
    }

    insertImage() {

        const newSection = document.createElement("section")
        newSection.className = "section image"

        const newImage = document.createElement("img")
        newImage.setAttribute('src', this.insertImagePreview.current.getAttribute('src'))
        newImage.className = "rounded image-fluid"

        const newCation = document.createElement("p")
        newCation.contentEditable = "true"
        newCation.onkeydown = this.onEnter
        newCation.setAttribute("placeholder", "Type caption for image (optional)")

        const newRemoveButton = document.createElement('div')
        newRemoveButton.className = "remove-button"

        newSection.appendChild(newImage)
        newSection.appendChild(newCation)
        newSection.appendChild(newRemoveButton)

        this.content.current.replaceChild(newSection, this.focusedSection.current)
        this.toggleImageInsertModal()
        this.setState({
            showInsertButton: false
        })
    }

    toggleImageInsertModal() {
        this.setState({
            showImageInsertModal: !this.state.showImageInsertModal
        })
    }

    onTitleChange(e) {
        this.setState({
            post: {
                ...this.state.post,
                title: e.target.value
            }
        })
    }

    onKeyUp(e) {

        const words = this.content.current.innerText.replace(/\n/g, " ").split(" ").length -1

        this.setState({
            words: words > 0 ? words : 0
        })

        if (this.focusedSection.current) {
            this.setState({
                showInsertButton: this.focusedSection.current.childNodes.length === 0
            })
        }
    }

    onEnter(e) {

        const keyCode = e.which

        if (keyCode === 8) {
            this.onBackspace(e)
        }

        if (keyCode !== 13 || e.shiftKey) {
            return
        }

        e.preventDefault()

        const newSection = document.createElement("div")
        newSection.contentEditable = "true"
        newSection.className = "section"
        newSection.onkeydown = this.onEnter
        newSection.onkeyup = this.onKeyUp
        newSection.onmouseover = this.onSectionHover
        newSection.onfocus = this.onSectionFocus
        newSection.onblur = this.onSectionBlur
        newSection.setAttribute("placeholder", "Begin writing a story...")

        if (this.content.current.children.length < 1) {
            newSection.setAttribute("key", "0")
            this.content.current.appendChild(newSection)
        } else {

            const id = parseInt(document.activeElement.getAttribute('key'), 10) + 1
            newSection.setAttribute("key", id)

            if (id >= this.content.current.children.length) {
                this.content.current.appendChild(newSection)
            } else {
                this.content.current.insertBefore(newSection, this.content.current.children[id])

                for (let i = id; i < this.content.current.children.length; i++) {
                    this.content.current.children[i].setAttribute("key", i)
                }
            }
        }

        newSection.focus()
    }

    insertSection(newSection) {

        if (this.content.current.children.length < 1) {
            newSection.setAttribute("key", "0")
            this.content.current.appendChild(newSection)
        } else {

            const id = parseInt(document.activeElement.getAttribute('key'), 10) + 1
            newSection.setAttribute("key", id)

            if (id >= this.content.current.children.length) {
                this.content.current.appendChild(newSection)
            } else {
                this.content.current.insertBefore(newSection, this.content.current.children[id])

                for (let i = id; i < this.content.current.children.length; i++) {
                    this.content.current.children[i].setAttribute("key", i)
                }
            }
        }
    }

    onBackspace(e) {

        if (!this.focusedSection.current) {
            return
        }

        const isEmpty = this.focusedSection.current.childNodes.length === 0

        if (isEmpty) {

            e.preventDefault()

            let previousSection = 0
            for (let i = 0; i < this.content.current.childNodes.length; i++) {
                if (this.content.current.childNodes[i] === this.focusedSection.current) {
                    previousSection = i
                    break
                }
            }

            this.content.current.removeChild(this.focusedSection.current)

            if (previousSection > 0) {
                placeCaretAtEnd(this.content.current.childNodes[previousSection - 1])
            } else {
                this.heading.current.focus()
                this.focusedSection.current = undefined
            }
        }
    }

    onSectionHover(e) {
    }

    onSectionBlur(e) {
    }

    onSectionFocus(e) {

        this.focusedSection.current = e.target
        const isEmpty = this.focusedSection.current.childNodes.length === 0

        this.setState({
            showInsertButton: isEmpty,
        })

        if (!isEmpty) {
            placeCaretAtEnd(this.focusedSection.current)
            return
        }

        this.insertButton.current.style.top = `calc(${e.target.getBoundingClientRect().top + window.scrollY}px + 0.2rem)`
        this.insertButton.current.style.left = `calc(${e.target.getBoundingClientRect().left}px - 3rem)`
    }

    updateTools() {

        const selection = window.getSelection()

        if (selection.rangeCount === 0) {
            return
        }

        const hasSelection = window.getSelection().toString().length !== 0
        const isInContent = window.getSelection().containsNode(this.content.current, true)

        this.setState({
            showTools: hasSelection && isInContent
        })

        if (!hasSelection) {
            return
        }

        const rect = selection.getRangeAt(0).getBoundingClientRect()
        const left = rect.left + rect.width / 2 - this.tools.current.offsetWidth / 2

        this.tools.current.style.top = `calc(${rect.top + window.scrollY}px - 3rem)`
        this.tools.current.style.left = `${left > 0 ? left : 0 }px`
    }

    execCommand(name, value) {
        if (value) {
            document.execCommand(name, false, value)
        } else {
            document.execCommand(name)
        }
    }

    render() {

        return (
            <Fragment>
                <div className="skeleton-editor">
                    <div className="skeleton-editor-controls">
                        <Link to={ process.PUBLIC_URL + "/" }>
                            Back
                        </Link>
                        <p className="text-secondary">
                            { this.state.status }
                        </p>
                    </div>

                    <div className="skeleton-editor-controls">
                        <p className="publish-button">
                            Publish
                        </p>
                    </div>

                    <div className="text-secondary skeleton-editor-words">
                        <p>{ this.state.words + " words" }</p>
                    </div>

                    <div className="container">
                        <input ref={ this.heading } type="text" className={ this.state.post.title === "" ? "text-muted title" : "title"} onChange={ this.onTitleChange } value={ this.state.post.title } placeholder="Story Title" onKeyDown={ this.onEnter } />
                        <div ref={ this.content } />
                    </div>
                </div>

                <Modal isOpen={ this.state.showImageInsertModal } toggle={ this.toggleImageInsertModal } size="lg">
                    <ModalHeader toggle={ this.toggleImageInsertModal }>Insert an image</ModalHeader>
                    <ModalBody>



                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">Upload</span>
                            </div>
                            <div className="custom-file">
                                <form className="input-group" id="img2b64" onChange={ this.onLoadImage }>
                                    <input type="file" className="custom-file-input" id="fileInput" />
                                </form>
                                <label className="custom-file-label" htmlFor="fileInput">Click here to choose a file</label>
                            </div>
                        </div>


                        <hr className="my-4" />
                        <img className="img-thumbnail rounded mx-auto d-block image-fluid" ref={ this.insertImagePreview } alt="Preview" src={ imagePlaceholder } />

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={ this.insertImage }>Insert</Button>{' '}
                        <Button color="secondary" onClick={ this.toggleImageInsertModal }>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <div className={ `btn-group selection-tool${this.state.showTools ? '' : ' d-none'}`} role="group" ref={ this.tools }>
                    <button type="button" className="btn btn-dark" onClick={ () => this.execCommand("bold") }><i className="fas fa-bold"></i></button>
                    <button type="button" className="btn btn-dark" onClick={ () => this.execCommand("italic") }><i className="fas fa-italic"></i></button>
                    <button type="button" className="btn btn-dark" onClick={ () => this.execCommand("formatBlock", "<h2>") }><i className="fas fa-heading"></i></button>
                    <button type="button" className="btn btn-dark" onClick={ () => this.execCommand("formatBlock", "<blockquote>") }><i className="fas fa-quote-right"></i></button>
                    <button type="button" className="btn btn-dark" onClick={ () => this.execCommand("createLink", window.getSelection().toString()) }><i className="fas fa-link"></i></button>
                </div>

                <div className={ `insert-button${this.state.showInsertButton ? '' : ' d-none'}`} role="group" ref={ this.insertButton } onClick={ this.toggleImageInsertModal } title="Add an image" />
            </Fragment>

        )
    }
}

Editor.propTypes = {
    session: PropTypes.instanceOf(Session).isRequired
}

function placeCaretAtEnd(el) {

    if (document.activeElement !== el) {
        el.focus()
    }

    const range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(false)

    let sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
}

export default Editor
