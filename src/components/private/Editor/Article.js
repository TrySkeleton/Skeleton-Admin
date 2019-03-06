import { decorate, observable } from 'mobx'

class Article {
    id
    title
    content
    coverURL
    isPublished

    coverURLIsValid
    checkerImage = new Image()

    constructor() {
        this.checkerImage.onload = () => this.coverURLIsValid = true
        this.checkerImage.onerror = () => this.coverURLIsValid = false
    }

    setArticle(id, title, content, coverURL, isPublished) {
        this.id = id
        this.setTitle(title)
        this.setContent(content)
        this.setCoverURL(coverURL)
        this.setPublished(isPublished)
    }

    setTitle(value) {
        this.title = value
    }

    setContent(value) {
        this.content = value
    }

    setCoverURL(value) {
        this.coverURL = value
        this.coverURLIsValid = false
        this.checkerImage.src = value
    }

    setPublished(value) {
        this.isPublished = !!value
    }
}

decorate(Article, {
    id: observable,
    title: observable,
    content: observable,
    coverURL: observable,
    coverURLIsValid: observable,
    isPublished: observable
})


export default Article