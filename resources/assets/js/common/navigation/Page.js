/**
 * Created by Sumit-Yadav on 06-10-2017.
 */
import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { logout } from '../../services/AuthService'
import { APP } from '../constants'

import { Button, Menu, MenuDivider, MenuItem, Popover, Position } from "@blueprintjs/core";


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
        const current_path = this.props.path;

        this.avatar = (
            <span>
              <img className="mr-2 align-text-bottom" style={{width: '20px'}} src={require('../../../images/avatar/boy.png')}/>
              <small className="mr-2 align-text-bottom">{this.props.userName}</small>
            </span>
        );

        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
              <Link className="navbar-brand" to="/">{APP.NAME}</Link>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="dropdown ml-auto">
                      <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.avatar}
                      </button>
                      <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                        <a className="dropdown-item disabled" href="#"><small>{"Signed in as " + this.props.userName}</small></a>
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
