import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { logout } from '../../services/AuthService'
import { APP } from '../constants'

import { Toast } from "../toaster"


class Page extends React.Component {
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

        this.avatar = (
            <span>
              <img className="mr-3 align-text-middle rounded-circle" style={{width: '35px', height: '35px'}} src={require('../../../../images/avatar/kit2.jpg')}/>
              <small className="mr-2 align-text-middle">{this.props.userName}</small>
            </span>
        );

        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm" style={{'flex' : '1 0 50%'}}>
              <Link className="text-dark" to="/">{APP.NAME}</Link>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="dropdown ml-auto">
                      <button className="btn dropdown-toggle p-0 mr-2" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.avatar}
                      </button>
                      <div className="dropdown-menu dropdown-menu-right shadow border" aria-labelledby="dropdownMenuButton">
                        <span className="dropdown-header"><small>{"Signed in as " + this.props.userName}</small></span>
                        <Link className="dropdown-item" to="account">Account</Link>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item" onClick={this.handleLogout} type="button" key="logout">Sign out</button>
                      </div>
                    </div>
              </div>
            </nav>
        );
    }
}

Page.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default Page;
