import { decorate, observable } from 'mobx'

class Article {
    id = -1
    created_at
    updated_at
    published_at
    title
    content
    preview
    cover_image_url
    slug

    loadArticle(id) {
        // Fetch
    }
}

decorate(Article, {
    id: observable,
    created_at: observable,
    updated_at: observable,
    published_at: observable,
    title: observable,
    content: observable,
    preview: observable,
    cover_image_url: observable,
    slug: observable
})

export default Article