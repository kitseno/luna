import React from 'react'

import {
        Callout,
        Button,
        Card,
        FormGroup,
        InputGroup,
      } from "@blueprintjs/core"


import { logout } from '../../services/AuthService'

import {Link, Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import ReeValidate from 'ree-validate'
import {AuthService} from '../../services'
import PageHeader from '../../common/pageHeader'

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.validator = new ReeValidate({
            password: 'required|min:6',
            password_confirmation: 'required|min:6',
            token: 'required',
            email: 'required'
        });
        this.state = {
            credentials: {
                password: '',
                password_confirmation: '',
                token: this.props.match.params.token,
                email: this.props.match.params.email.replace("29gnmLTv686QsnV","@")
                // email: this.props.match.params.email,
            },
            responseError: {
                isError: false,
                code: '',
                errors: ''
            },
            isSuccess: false,
            isLoading: false,
            errors: this.validator.errors
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        const {credentials} = this.state;
        credentials[name] = value;

        this.validator.validate(name, value)
            .then(() => {
                const {errors} = this.validator;
                this.setState({errors: errors, credentials})
            });
    }

    handleSubmit(event) {
        event.preventDefault();

        const {credentials} = this.state;

        this.validator.validateAll(credentials)
            .then(success => {
                if (success) {
                    this.setState({
                        isLoading: true
                    });
                    this.submit(credentials);
                }
            });
    }

    submit(credentials) {
        this.props.dispatch(AuthService.updatePassword(credentials))
            .then((result)  => {
                this.setState({
                    isLoading: false
                });
                this.setState({
                    isSuccess: true,
                });

                this.setState({
                    credentials: {
                        password: '',
                        password_confirmation: '',
                        token: this.props.match.params.token,
                        email: this.props.match.params.email.replace("29gnmLTv686QsnV","@")
                    }
                });
            })
            .catch(({error, statusCode}) => {

                const responseError = {
                    isError: true,
                    code: statusCode,
                    errors: error.errors,
                    message: error.message,
                };

                this.setState({responseError});

                this.setState({
                    isLoading: false
                });

                this.setState({
                    credentials: {
                        password: '',
                        password_confirmation: '',
                        token: this.props.match.params.token,
                        email: this.props.match.params.email.replace("29gnmLTv686QsnV","@")
                    }
                });
            })
    }

    componentDidMount() {
        this.setState({
            isLoading: false
        });
        this.props.dispatch(logout());
    }

    render() {

        const {errors} = this.state;

        return (

            <div className="container mt-5 mh-100">
                <PageHeader heading="Password reset page"/>
                    <div className="row align-items-center mt-3">
                        <div className="col-md-6 col-lg-4">
                          <Card className="p-4">
                            <Link to='/' className="bp3-text-small" replace>Back to home</Link>
                            <h4 className={"bp3-heading"}>Change your password</h4>
                            <form onSubmit={this.handleSubmit}>
                                    <FormGroup
                                        helperText={errors.has('password') && errors.first('password')}
                                        labelFor="password"
                                        intent='danger'
                                        className="mb-1"
                                    >
                                        <InputGroup value={this.state.credentials.password} type="password" large className={errors.has('password') && 'bp3-intent-danger'} id="password" name="password" placeholder="New Password" disabled={this.state.isLoading} onChange={this.handleChange} />
                                    </FormGroup>

                                    <FormGroup
                                        helperText={errors.has('password_confirmation') && errors.first('password_confirmation')}
                                        labelFor="password_confirmation"
                                        intent='danger'
                                        className="mb-1"
                                    >
                                        <InputGroup value={this.state.credentials.password_confirmation} type="password" large className={errors.has('password_confirmation') && 'bp3-intent-danger'} id="password_confirmation" name="password_confirmation" placeholder="Confirm Password" disabled={this.state.isLoading} onChange={this.handleChange} />
                                    </FormGroup>
                                    <Button fill intent="primary" type="submit" className="mt-4" loading={this.state.isLoading}>Change Password</Button>
                                    {(this.state.responseError.isError && this.state.responseError.message && !this.state.responseError.errors) && <Callout className="mt-1" intent="danger">
                                        {this.state.responseError.message}
                                    </Callout>}

                                    {(this.state.responseError.isError && this.state.responseError.errors) && <Callout className="mt-1" intent="danger">
                                        {this.state.responseError.errors.password[0]}
                                    </Callout>}
                                    {(this.state.isSuccess && !this.state.responseError.isError) && <Callout className="mt-1" intent="success">
                                        We've successfully changed your password. We know you might forget your password so we send it to your e-mail. *wink*
                                    </Callout>}
                            </form>
                            </Card>
                        </div>
                    </div>
            </div>
        );
    }
}

Page.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
};

export default Page;
