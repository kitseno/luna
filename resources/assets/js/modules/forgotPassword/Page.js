import React from 'react'
import {
        Callout,
        Button,
        Card,
        FormGroup,
        InputGroup,
      } from "@blueprintjs/core"
import {Link, Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import { Validator } from 'ree-validate'
import {AuthService} from '../../services'
import PageHeader from '../../common/pageHeader'

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.validator = new Validator({
            email: 'required|email',
        });

        this.state = {
            credentials: {
                email: '',
            },
            responseError: {
                isError: false,
                code: '',
                text: ''
            },
            isSuccess: false,
            isLoading: false,
            errors: this.validator.errorBag
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
                const {errorBag} = this.validator;
                this.setState({errors: errorBag, credentials})
            })
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
        this.props.dispatch(AuthService.resetPassword(credentials))
            .then((result)  => {
                this.setState({
                    isLoading: false
                });
                this.setState({
                    isSuccess: true,
                });
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
            })
    }

    componentDidMount(){
        this.setState({
            isLoading: false
        });
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } };
        const { isAuthenticated } = this.props;

        if (isAuthenticated) {
            return (
                <Redirect to={from}/>
            )
        }
        const {errors} = this.state;

        const email_error = errors.has('email') && errors.first('email');

        return (
            <div className="container mt-5 mh-100">
                <PageHeader heading="Password reset page"/>
                    <div className="row align-items-center mt-3">
                        <div className="col-md-6 col-lg-4">
                          <Card className="p-4">
                            <Link to='/' className="bp3-text-small" replace>Back to home</Link>
                            <h4 className={"bp3-heading"}>Reset your password</h4>
                            <form onSubmit={this.handleSubmit}>
                                    <FormGroup
                                        helperText={email_error}
                                        labelFor="email"
                                        intent='danger'
                                        className="mb-1"
                                    >
                                        <InputGroup large className={errors.has('email') && 'bp3-intent-danger'} id="email" name="email" placeholder="E-mail address" disabled={this.state.isLoading} onChange={this.handleChange} />
                                    </FormGroup>
                                    <Button fill intent="primary" type="submit" loading={this.state.isLoading}>Reset Password</Button>
                                    {this.state.responseError.isError && <Callout className="mt-1" intent="danger">
                                        {this.state.responseError.text.message}
                                    </Callout>}
                                    {this.state.isSuccess && <Callout className="mt-1" intent="success">
                                        If the email you entered exists, a reset link has been sent !
                                    </Callout>}
                            </form>
                            <Callout className="mt-4">
                                New to us? <Link to='/register' replace>Sign up</Link> or <Link to="/login" replace>Sign in</Link>
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
