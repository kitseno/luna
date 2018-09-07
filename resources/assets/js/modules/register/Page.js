import React from 'react'
import {Dimmer, Form, Grid, Header, Loader, Message, Segment} from 'semantic-ui-react'
import {
        Button,
        Card,
        FormGroup,
        InputGroup,
        Callout,
      } from "@blueprintjs/core"
import {Link, Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import ReeValidate from 'ree-validate'
import {AuthService} from '../../services'
import PageHeader from '../../common/pageHeader'

import ability from '../../utils/casl/ability'

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.validator = new ReeValidate({
            name: 'required|min:3',
            email: 'required|email',
            password: 'required|min:6',
            password_confirmation: 'required|min:6',
        });

        this.state = {
            credentials: {
                name: '',
                email: '',
                password: '',
                password_confirmation: ''
            },
            responseError: {
                isError: false,
                code: '',
                text: ''
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
        this.props.dispatch(AuthService.register(credentials))
            .then((res)  => {

                this.setState({
                    isLoading: false
                });
                this.setState({
                    isSuccess: true,
                });

                const credentials = {
                    name: '',
                    email: '',
                    password: '',
                    password_confirmation: ''
                };
                
                // reset form credentials
                this.setState({credentials});

                if (res.user) {
                    ability.update(res.user.scopes);
                }
            })
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

                const credentials = {
                    name: this.state.credentials.name,
                    email: this.state.credentials.email,
                    password: '',
                    password_confirmation: ''
                };
                
                // reset form credentials
                this.setState({credentials});
            })
    }

    componentDidMount() {
        this.setState({
            isLoading: false
        });
    }

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to='/' replace/>
        }
        const {errors} = this.state;
        const { name, email, password, password_confirmation } = this.state.credentials;

        const name_error = errors.has('name') && errors.first('name');
        const email_error = errors.has('email') && errors.first('email');
        const password_error = errors.has('password') && errors.first('password');
        const cpassword_error = errors.has('password_confirmation') && errors.first('password_confirmation');

        return (
            <div className="container mt-5 mh-100">
                <PageHeader heading="Registration page"/>
                    <div className="row align-items-center mt-3">
                        <div className="col-md-6 col-lg-4">
                          <Card className="p-4">
                            <Link to='/' className="bp3-text-small" replace>Back to home</Link>
                            <h4 className={"bp3-heading"}>Sign up for new account</h4>
                                {this.state.responseError.isError && <Callout intent="danger">
                                    {this.state.responseError.text}
                                </Callout>}
                                <form>
                                    <FormGroup
                                        helperText={name_error}
                                        labelFor="name"
                                        intent='danger'
                                        className="mb-1"
                                    >
                                        <InputGroup large value={name} className={errors.has('name') && 'bp3-intent-danger'} id="name" name="name" placeholder="Name" disabled={this.state.isLoading} onChange={this.handleChange} />
                                    </FormGroup>

                                    <FormGroup
                                        helperText={email_error}
                                        labelFor="email"
                                        intent='danger'
                                        className="mb-1"
                                    >
                                        <InputGroup large value={email} className={errors.has('email') && 'bp3-intent-danger'} id="email" name="email" placeholder="E-mail address" disabled={this.state.isLoading} onChange={this.handleChange} />
                                    </FormGroup>

                                    <FormGroup
                                        helperText={password_error}
                                        labelFor="password"
                                        intent='danger'
                                        className="mb-1"
                                    >
                                        <InputGroup large type="password" value={password} className={errors.has('password') && 'bp3-intent-danger'} id="password" name="password" placeholder="Password" disabled={this.state.isLoading} onChange={this.handleChange} />
                                    </FormGroup>

                                    <FormGroup
                                        helperText={cpassword_error}
                                        labelFor="password_confirmation"
                                        intent='danger'
                                    >
                                        <InputGroup large type="password" value={password_confirmation} className={errors.has('password_confirmation') && 'bp3-intent-danger'} id="password_confirmation" name="password_confirmation" placeholder="Confirm Password" disabled={this.state.isLoading} onChange={this.handleChange} />
                                    </FormGroup>
                                    <Button fill intent="primary" onClick={this.handleSubmit} loading={this.state.isLoading}>Sign up</Button>
                                    {this.state.isSuccess && <Callout className="mt-1" intent="success">
                                        Sign up Successfully ! <Link to='/login' replace>Log in</Link> here
                                    </Callout>}
                                </form>
                        <Callout className="mt-4">
                            Already registered? <Link to='/login' replace>Sign in</Link>
                        </Callout>
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
