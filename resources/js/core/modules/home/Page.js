import React from 'react'

import {Link} from 'react-router-dom'

import { socialLogin } from '../../services/AuthService'

import Web from '../../layouts/web'

class Page extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const social = this.props.match.params.social
        const params = this.props.location.search

        if (params && social) {
            this.props.dispatch(socialLogin({ params, social }))
                .catch(({error, statusCode}) => {
                const responseError = {
                    isError: true,
                    code: statusCode,
                    text: error
                };
                this.setState({responseError});
                this.setState({
                    isLoading: false
                });
            })
        }
    }

    render() {
        return (
            <Web path={this.props.location.pathname}>
                  <main role="main" className="pl-3 pr-3 d-flex" style={{height: '400px'}}>
                    <div className="align-self-center">
                        <h1 className="mb-0">
                            Boilerplate
                        </h1>
                        <small className="mb-5">by Kit S.</small>
                        <p className="lead mt-2">
                            <em className="text-muted fas fa-circle-notch fa-spin fa-xs mr-2 align-baseline"></em>
                            <span className="align-middle">
                                Under construction
                            </span>
                        </p>
                    </div>
                  </main>
            </Web>
        );
    }
}

export default Page;
