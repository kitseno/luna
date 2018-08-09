import React from 'react'

import {connect} from 'react-redux'
import {NavLink, Link} from 'react-router-dom'

import {APP} from '../constants'

import { logout } from '../../services/AuthService'

import { Toast } from "../toaster"

class PageHeader extends React.Component {

    constructor(props) {
        super(props);
        
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        event.preventDefault();
        // this.props.dispatch(actions.authLogout());
        this.props.dispatch(logout());
        Toast.show({ message: "See you later, old friend.", icon: "hand", intent: "warning"});
    }

    render() {
        const current_path = this.props.path;

        this.avatar = (
            <span>
              <img className="mr-2 align-text-bottom" style={{width: '20px'}} src={require('../../../images/avatar/boy.png')}/>
              <small className="mr-2 align-text-bottom">{this.props.userName}</small>
            </span>
        );

        return (
            <nav className="mt-4 navbar navbar-expand-lg navbar-light">
              <Link className="navbar-brand" to="/">{APP.NAME}</Link>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav ml-auto">
                  <Link className={"nav-item nav-link" + (current_path == '/' ? ' active' : '')} to="/">home <span className="sr-only">(current)</span></Link>
                  <Link className={"nav-item nav-link ml-lg-4" + (current_path == '/about' ? ' active' : '')} to="/about">about</Link>
                  <Link className={"nav-item nav-link ml-lg-4" + (current_path == '/contact' ? ' active' : '')} to="/contact">contact</Link>
                </div>
                    {this.props.isAuthenticated
                      ? <div className="dropdown ml-lg-4">
                          <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.avatar}
                          </button>
                          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item disabled" href="#"><small>{"Signed in as " + this.props.userName}</small></a>
                            <Link className="dropdown-item" to="/account">Account</Link>
                            <Link className="dropdown-item" to="/profile">Profile</Link>
                            <div className="dropdown-divider"></div>
                            {this.props.isAdmin && <Link className="dropdown-item" to="/admin"><i className="fas fa-sign-in-alt mr-2"></i>Go to Admin</Link>}
                            {this.props.isAdmin && <div className="dropdown-divider"></div>}
                            <button className="dropdown-item" onClick={this.handleLogout} type="button" key="logout">Sign out</button>
                          </div>
                        </div>
                      :
                        <div className="btn-group ml-md-4" role="group" aria-label="Login">
                          <Link to="/login" className="btn btn-light">Login</Link>
                          <Link to="/register" className="btn btn-light">Register</Link>
                        </div>
                    }
              </div>
            </nav>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated : state.Auth.isAuthenticated,
        isAdmin : state.Auth.isAdmin,
        userName : state.Auth.user.name,
        userEmail : state.Auth.user.email,
    }
};

export default connect(mapStateToProps)(PageHeader)
