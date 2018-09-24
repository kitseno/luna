import React from 'react'
import {
        Button,
        Card,
        FormGroup,
        InputGroup,
        Callout,
        Dialog,
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
                code: '',
                text: '',
            },
            isLoading: false,
            errors: this.validator.errors,

            resendEmailVerifyDialogOpen: false,
            resendEmailVerifySuccess: false,

            emailVerificationSuccess: false,
            emailVerificationTokenInvalid: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.hash == '#resend') {
            this.setState({resendEmailVerifyDialogOpen: true}, () => {
                this.resendEmailVerification(this.state.credentials.email);
            });
            this.props.history.push({hash:''}); 
        }
    }

    componentDidMount() {
        this.setState({
            isLoading: false
        });

        // Display email verification success
        const {search} = this.props.location;
        const status = search.replace("?","").split("&")[0].split("=");

        if (status[0] == 'email_verification_success') {
            this.props.history.push('/login');
            this.setState({emailVerificationSuccess: status[1]});
        } else if (status[0] == 'token_invalid') {
            this.setState({emailVerificationTokenInvalid: status[1]});
            this.props.history.push('/login');
        }
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
            })
            .then(error => {
                const {errors} = this.validator;
                this.setState({errors: errors, credentials})
            });
    }

    resendEmailVerification(email) {
        this.props.dispatch(AuthService.resendEmailVerification(email))
            .then((res) => {
                console.log(res);

                this.setState({resendEmailVerifySuccess: true});
            })
            .catch((err) => {
                console.log(err);
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

                console.log(error);

                const responseError = {
                    isError: true,
                    code: statusCode,
                    error: error
                };

                this.setState({responseError}, () => {
                    this.setState({isLoading: false});
                });
                
            })

    }

    onSocialClick(param, e) {
       window.location.assign(`redirect/${param}`);
       this.setState({
           isLoading: true
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

        const resendEmailVerifyDialog = (
                <Dialog small isOpen={this.state.resendEmailVerifyDialogOpen} style={{padding: 0}}>
                    <div className="bp3-dialog-body">
                        {
                            this.state.resendEmailVerifySuccess ?
                            <div>
                                <em className="fas fa-check mr-2 text-success"></em>
                                <small>Email successfully sent! Please check your email for the link.</small>
                                <button type="button" className="btn btn-link float-right p-0" onClick={()=>this.setState({resendEmailVerifyDialogOpen: false, resendEmailVerifySuccess: false})}><em className="fas fa-times-circle text-muted"></em></button>
                            </div>
                            :
                            <div>
                                <em className="fas fa-spinner fa-spin mr-2 text-primary"></em>
                                <small>Resending verification email ...</small>
                            </div>
                        }
                    </div>
                </Dialog>
            )

        return (
            <div className="container mt-5 mh-100">
                {resendEmailVerifyDialog}
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
                                            {
                                                this.state.responseError.error.message ?
                                                <div dangerouslySetInnerHTML={{ __html: this.state.responseError.error.message }}/>
                                                :
                                                <div dangerouslySetInnerHTML={{ __html: this.state.responseError.error.email }}/>
                                            }
                                        </Callout>
                                    }

                                    {
                                        this.state.emailVerificationSuccess &&
                                        <Callout className="mt-1" intent="success">
                                            Email verification success! You may now sign in to your account.
                                        </Callout>
                                    }

                                    {
                                        this.state.emailVerificationTokenInvalid &&
                                        <Callout className="mt-1" intent="warning">
                                            Verification link expired.
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
