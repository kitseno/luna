import React from 'react'
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
            first_name: 'required|min:1',
            last_name: 'required|min:1',
            email: 'required|email',
            password: 'required|min:6',
            password_confirmation: 'required|min:6',
        });

        const dict = {
            custom: {
                password_confirmation: {
                    'required': 'The confirm password field is required.',
                }
            }
        };

        this.validator.localize('en', dict);

        this.state = {
            credentials: {
                first_name: '',
                last_name: '',
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
            responseSuccess: '',
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
            })
            .then(error => {
                const {errors} = this.validator;
                this.setState({errors: errors, credentials})
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
                    first_name: '',
                    last_name: '',
                    email: '',
                    password: '',
                    password_confirmation: ''
                };
                
                // reset form credentials
                this.setState({credentials});

                this.setState({responseSuccess: res.message});

                if (res.user) {
                    ability.update(res.user.scopes);
                }
            })
            .catch(({error, statusCode}) => {

                console.log(error);

                const responseError = {
                    isError: true,
                    code: statusCode,
                    errors: error.errors
                };
                this.setState({responseError});
                this.setState({
                    isLoading: false
                });

                const credentials = {
                    first_name: this.state.credentials.first_name,
                    last_name: this.state.credentials.last_name,
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
        const { first_name, last_name, email, password, password_confirmation } = this.state.credentials;

        const first_name_error = errors.has('first_name') && errors.first('first_name');
        const last_name_error = errors.has('last_name') && errors.first('last_name');
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
                                {
                                    this.state.responseError.isError &&
                                    <Callout intent="danger">
                                        {this.state.responseError.errors.first_name && <p>{this.state.responseError.errors.first_name}</p>}
                                        {this.state.responseError.errors.last_name && <p>{this.state.responseError.errors.last_name}</p>}
                                        {this.state.responseError.errors.password && <p>{this.state.responseError.errors.password}</p>}
                                        {this.state.responseError.errors.email && <p>{this.state.responseError.errors.email}</p>}
                                    </Callout>
                                }
                                <form>
                                    <FormGroup
                                        helperText={first_name_error}
                                        labelFor="first_name"
                                        intent='danger'
                                        className="mb-1"
                                    >
                                        <InputGroup large value={first_name} className={errors.has('first_name_error') && 'bp3-intent-danger'} id="first_name" name="first_name" placeholder="First name" disabled={this.state.isLoading} onChange={this.handleChange} />
                                    </FormGroup>

                                    <FormGroup
                                        helperText={last_name_error}
                                        labelFor="last_name"
                                        intent='danger'
                                        className="mb-1"
                                    >
                                        <InputGroup large value={last_name} className={errors.has('last_name_error') && 'bp3-intent-danger'} id="last_name" name="last_name" placeholder="Last name" disabled={this.state.isLoading} onChange={this.handleChange} />
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
                                        <InputGroup large type="password" value={password_confirmation} className={errors.has('password_confirmation') && 'bp3-intent-danger'} id="password_confirmation" name="password_confirmation" placeholder="Confirm password" disabled={this.state.isLoading} onChange={this.handleChange} />
                                    </FormGroup>
                                    <Button fill intent="primary" className="bg-primary" onClick={this.handleSubmit} loading={this.state.isLoading}>Sign up</Button>
                                    {this.state.isSuccess && <Callout className="mt-1" intent="success">
                                        <div dangerouslySetInnerHTML={{ __html: this.state.responseSuccess}}/>
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
