import './Editor.css'
import PropTypes from "prop-types"

import React, {Component, Fragment} from 'react'
import { Link } from 'react-router-dom'
import { Session } from '../../../Session'
import DiffMatchPatch from 'diff-match-patch'
import Net from '../../../connect'
import crypto from 'crypto'

import EditorImageUploader from './EditorImageUploader'
import EditorProperties from './EditorProperties'
import Article from "./Article"

const SavingState = {
    SAVED: "Saved",
    SAVING: "Saving...",
    UNSAVED: "Unsaved"
}

class Editor extends Component {

    constructor(props) {
        super(props)

        this.state = {
            words: 0,
            lastSaved: {
                content: this.props.article.content
            },
            savingState: SavingState.SAVED,
            showImageInsertModal: false,
            showInsertButton: false,
            showTools: false,
            showArticleProperties: false,
            showImageUploader: false
        }

        this.save = this.save.bind(this)
        this.requestSave = this.requestSave.bind(this)
        this.execCommand = this.execCommand.bind(this)
        this.onTitleChange = this.onTitleChange.bind(this)
        this.onSectionFocus = this.onSectionFocus.bind(this)
        this.onBackspace = this.onBackspace.bind(this)
        this.onEnter = this.onEnter.bind(this)
        this.onKeyUp = this.onKeyUp.bind(this)
        this.insertSection = this.insertSection.bind(this)
        this.updateTools = this.updateTools.bind(this)
        this.onInsertImage = this.onInsertImage.bind(this)
        this.updateWordsCount = this.updateWordsCount.bind(this)

        this.insertButton = React.createRef()
        this.tools = React.createRef()
        this.content = React.createRef()
        this.heading = React.createRef()
        this.focusedSection = React.createRef()
    }

    componentDidMount() {
        document.addEventListener("selectionchange", this.updateTools)
        window.addEventListener("resize", this.updateTools)

        this.content.current.innerHTML = this.props.article.content
        this.updateWordsCount()

        document.querySelectorAll('.section').forEach(m => {
            m.onkeydown = this.onEnter
            m.onkeyup = this.onKeyUp
            m.onfocus = this.onSectionFocus
            m.contentEditable = true
        })
    }

    componentWillUnmount() {
        document.removeEventListener("selectionchange", this.updateTools)
        window.removeEventListener("resize", this.updateTools)
        window.clearTimeout(this.savingTimeout)
    }

    onInsertImage(imageURL) {

        const newSection = document.createElement("img")
        newSection.src = imageURL
        newSection.className = "section img-fluid"
        newSection.onfocus = this.onSectionFocus
        this.insertSection(newSection)
        newSection.focus()
    }

    requestSave() {
        window.clearTimeout(this.savingTimeout)
        this.savingTimeout = setTimeout(() => {
            this.save()
        }, 1000)

        this.setState({
            savingState: SavingState.SAVING
        })
    }

    save() {

        this.setState({
            savingState: SavingState.SAVING
        })

        const currentContent = this.content.current.innerHTML.replace(/contenteditable="true"/g, "") || ""
        const lastSavedContent = this.state.lastSaved.content || ""

        const dmp = new DiffMatchPatch()
        const patches = dmp.patch_make(lastSavedContent, currentContent)
        const checkSum = crypto.createHash('md5').update(currentContent).digest("hex")

        Net.request(this.props.session, "_skeleton", {
            action: "PATCH_ARTICLE",
            id: this.props.article.id,
            patches,
            checkSum,
            title: this.props.article.title
        }).then(() => {
            this.setState({
                lastSaved: {
                    content: currentContent
                },
                savingState: SavingState.SAVED
            })
        }).catch(e => {
            console.log(e)
        })
    }

    updateTools() {

        // Update insert button
        if (this.focusedSection.current) {
            const target = this.focusedSection.current
            this.insertButton.current.style.top = `calc(${target.getBoundingClientRect().top + window.scrollY}px + 0.2rem)`
            this.insertButton.current.style.left = `calc(${target.getBoundingClientRect().left}px - 3rem)`
        }

        // Update styling tools
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

        this.requestSave()
    }

    onTitleChange(e) {
        this.setState({
            article: {
                ...this.state.article,
                title: e.target.value
            },
            savingState: SavingState.UNSAVED
        })

        this.requestSave()
    }

    onKeyUp(e) {

        this.updateWordsCount()

        if (this.focusedSection.current) {
            this.setState({
                showInsertButton: this.focusedSection.current.childNodes.length === 0
            })
        }

        this.requestSave()
    }

    updateWordsCount() {
        const words = this.content.current.innerText.replace(/\n/g, " ").split(" ").length
        this.setState({
            words: words > 0 ? words : 0
        })
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
        newSection.onfocus = this.onSectionFocus
        this.insertSection(newSection)
        newSection.focus()
    }

    insertSection(newSection, index) {

        if (Number.isInteger(index) && index >= 0) {

            return
        }

        if (this.content.current.children.length < 1) {
            newSection.setAttribute("key", "0")
            this.content.current.appendChild(newSection)
        } else {
            const id = parseInt(document.activeElement.getAttribute('key')) + 1
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

        this.requestSave()
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

        this.updateTools()
    }

    render() {

        window.onbeforeunload = (e) => {
            if (this.state.savingState !== SavingState.SAVED) {
                e.preventDefault()
                e.returnValue = ''
            }
        }

        return (
            <Fragment>
                <div className="skeleton-editor">
                    <div className="skeleton-editor-controls">
                        <Link to={ process.PUBLIC_URL + "/" }>
                            Back
                        </Link>
                        <p className="text-secondary">
                            { this.state.savingState }
                        </p>
                    </div>

                    <div className="skeleton-editor-controls">
                        <button type="button" className="btn btn-outline-secondary" onClick={ () => {
                            this.setState({
                                showArticleProperties: true
                            })
                        }}>Properties</button>
                    </div>

                    <div className="text-secondary skeleton-editor-words">
                        <p>{ this.state.words + " words" }</p>
                    </div>

                    <div className="container">
                        <input
                            type="text"
                            placeholder="Story Title"
                            className={ this.props.article.title === "" ? "text-muted title" : "title"}
                            value={ this.props.article.title }
                            onChange={ (e) => this.props.article.setTitle(e.target.value) }
                            onKeyDown={ this.onEnter }
                            ref={ this.heading } />

                        <div ref={ this.content } />
                    </div>
                </div>

                <div className={ `btn-group selection-tool${this.state.showTools ? '' : ' d-none'}`} role="group" ref={ this.tools }>
                    <button type="button" className="btn btn-dark" onClick={ () => this.execCommand("bold") }><i className="fas fa-bold"/></button>
                    <button type="button" className="btn btn-dark" onClick={ () => this.execCommand("italic") }><i className="fas fa-italic"/></button>
                    <button type="button" className="btn btn-dark" onClick={ () => this.execCommand("formatBlock", "<h2>") }><i className="fas fa-heading"/></button>
                    <button type="button" className="btn btn-dark" onClick={ () => this.execCommand("createLink", window.getSelection().toString()) }><i className="fas fa-link"/></button>
                    <button type="button" className="btn btn-dark" onClick={ () => this.execCommand("justifyLeft")}><i className="fas fa-align-left"/></button>
                    <button type="button" className="btn btn-dark" onClick={ () => this.execCommand("justifyCenter")}><i className="fas fa-align-center"/></button>
                    <button type="button" className="btn btn-dark" onClick={ () => this.execCommand("justifyFull")}><i className="fas fa-align-justify"/></button>
                </div>

                <div
                    className={ `insert-button${this.state.showInsertButton ? '' : ' d-none'}`}
                    role="group"
                    ref={ this.insertButton }
                    onClick={ () => {
                        this.setState({
                            showImageUploader: true
                        })
                    }}
                    title="Add an image" />

                <EditorProperties
                    session={ this.props.session }
                    article={ this.props.article }
                    display={ this.state.showArticleProperties }
                    onToggle={ () => {
                        this.setState({
                            showArticleProperties: !this.state.showArticleProperties
                        })
                    }}
                />

                <EditorImageUploader
                    session={ this.props.session }
                    onInsert={ this.onInsertImage }
                    display={ this.state.showImageUploader }
                    onToggle={ () => {
                        this.setState({
                            showImageUploader: !this.state.showImageUploader
                        })
                    }}
                />
            </Fragment>
        )
    }
}

Editor.propTypes = {
    session: PropTypes.instanceOf(Session).isRequired,
    article: PropTypes.instanceOf(Article).isRequired
}

const placeCaretAtEnd = (el) => {

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
