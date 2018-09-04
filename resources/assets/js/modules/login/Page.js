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
import { Toast } from '../../common/toaster'

import ability from '../../utils/casl/ability'


class Page extends React.Component {

    constructor(props) {
        super(props);
        this.validator = new ReeValidate({
            email: 'required|email',
            password: 'required|min:6'
        });

        this.state = {
            credentials: {
                email: '',
                password: ''
            },
            responseError: {
                isError: false,
                code: '',
                text: '',
            },
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
        this.props.dispatch(AuthService.login(credentials))
            .then((res) => {

                // Update ability of user based on permissions
                ability.update(res.user.scopes)

              Toast.show({message: "You\'re logged in, "+res.user.name+"!", icon: "tick", intent: "success"});
            })
            .catch(({error, statusCode}) => {
                const responseError = {
                    isError: true,
                    code: statusCode,
                    text: error,
                };
                this.setState({responseError});
                this.setState({
                    isLoading: false
                });
            })

    }

    onSocialClick(param, e) {
       window.location.assign(`redirect/${param}`);
       this.setState({
           isLoading: true
       });
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

        const socials = ['facebook', 'twitter', 'linkedin', 'google', 'graph'];

        const email_error = errors.has('email') && errors.first('email');
        const password_error = errors.has('password') && errors.first('password');

        return (
            <div className="container mt-5 mh-100">
                <PageHeader heading="Login page"/>
                    <div className="row align-items-center mt-3">
                        <div className="col-md-6 col-lg-4">
                          <Card className="p-4">
                            <Link to='/' className="bp3-text-small" replace>Back to home</Link>
                            <h4 className={"bp3-heading"}>Please sign in</h4>
                            <form onSubmit={this.handleSubmit}>
                                    <FormGroup
                                        helperText={email_error}
                                        labelFor="email"
                                        intent='danger'
                                        className="mb-1"
                                    >
                                        <InputGroup large className={errors.has('email') && 'bp3-intent-danger'} id="email" name="email" placeholder="E-mail address" disabled={this.state.isLoading} onChange={this.handleChange} />
                                    </FormGroup>
                                    <FormGroup
                                        helperText={password_error}
                                        labelFor="password"
                                        intent='danger'
                                    >
                                        <InputGroup large className={errors.has('password') && 'bp3-intent-danger'} id="password" name="password" placeholder="Password" disabled={this.state.isLoading} onChange={this.handleChange} type="password" />
                                    </FormGroup>
                                    <Button fill intent="primary" type="submit" loading={this.state.isLoading}>Sign in</Button>
                                    {
                                        this.state.responseError.isError &&
                                        <Callout className="mt-1" intent="danger">
                                            {this.state.responseError.text.message ? this.state.responseError.text.message : this.state.responseError.text}
                                            {this.state.responseError.text == 'User not yet registered.' && <Link to="register" replace className="ml-1">Sign up here</Link>}
                                        </Callout>
                                    }
                                    <Link className="bp3-text-small" to='/forgot-password' replace>Forgot your password?</Link>
                                    <div className="mt-4 mb-4">
                                      <h6>or sign in with:</h6>
                                      <div className="btn-group" role="group" aria-label="Social login">
                                        {socials.map((social,i) => {
                                            if (social != 'google' && social != 'graph') {
                                             return <button type="button" key={i} onClick={this.onSocialClick.bind(this, social)} className={"btn btn-secondary"}><i className={"fab fa-"+social}></i></button>
                                           } else if (social == 'graph') {
                                             return <button type="button" key={i} onClick={this.onSocialClick.bind(this, social)} className={"btn btn-secondary"}><i className={"fab fa-microsoft"}></i></button>
                                           } else if (social == 'google') {
                                             return <button type="button" key={i} onClick={this.onSocialClick.bind(this, social)} className={"btn btn-secondary"}><i className={"fab fa-google-plus"}></i></button>
                                           }
                                         })}
                                       </div>
                                    </div>
                            </form>
                            <Callout>
                                New to us? <Link to='/register' replace>Sign up</Link>
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
