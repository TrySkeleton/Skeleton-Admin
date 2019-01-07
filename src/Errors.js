import React, {Component} from 'react'
import { Alert } from 'reactstrap'
import { decorate, observable } from 'mobx'
import PropTypes from "prop-types"

class ErrorsStore {

    errors = []

    clearErrors() {
        this.errors = []
    }

    pushError(err) {
        err.id = generateUniqueId()
        this.errors.push(err)
    }

    dismissError(errorId) {
        const index = this.errors.findIndex(e => e.id === errorId)
        this.errors.splice(index, 1)
    }
}

const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9)
}

decorate(ErrorsStore, {
    errors: observable
})

const errorsStore = new ErrorsStore()

class ErrorsView extends Component {

    onDismiss(errorId) {
        this.props.store.dismissError(errorId)
    }

    render() {

        const errors = this.props.store.errors.map(err => (
            <Alert className="skeleton-error" color="danger" key={ err.id } toggle={ () => this.onDismiss(err.id) }>
                <strong>Error: </strong> { err.message }
            </Alert>
        ))

        return (
            <div className="skeleton-errors">
                { errors }
            </div>
        )
    }
}

ErrorsView.propTypes = {
    store: PropTypes.instanceOf(ErrorsStore).isRequired,
}

export { ErrorsView }
export default errorsStore