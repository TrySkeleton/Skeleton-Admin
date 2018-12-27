import React, {Component} from 'react'
import Layout from './components/private/Layout'
import SignIn from './components/SignIn'
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom'
import NewStoryLoading from './components/private/NewStoryLoading'
import ArticleLoader from './components/private/ArticleLoader'
import Session from './Session'
import { observer } from 'mobx-react'

class App extends Component {

    render() {

        const display = Session.authenticated ? (
            <Switch>
                <Route exact path={ process.PUBLIC_URL + '/write/new' }>
                    <NewStoryLoading />
                </Route>

                <Route exact path={ process.PUBLIC_URL + '/write/:articleId' } render={ (props) => {
                    const articleId = parseInt(props.match.params.articleId)
                    return <ArticleLoader id={ articleId } session={ Session } />
                }} />

                <Route exact path={ process.PUBLIC_URL + '/signin' }>
                    <Redirect to={ process.PUBLIC_URL  + '/'} />
                </Route>

                <Route>
                    <Layout session={ Session } />
                </Route>
            </Switch>
        ) : (
            <Switch>
                <Route exact path={ process.PUBLIC_URL + '/signin' }>
                    <SignIn session={ Session } />
                </Route>

                <Route path='/'>
                    <Redirect to={ process.PUBLIC_URL  + '/signin'} />
                </Route>
            </Switch>
        )

        return (
            <BrowserRouter>
                { display }
            </BrowserRouter>
        )
    }
}

export default observer(App)
