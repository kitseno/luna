import React, { Component } from 'react'
import {NavLink, Link} from 'react-router-dom'

export default class LeftSidebar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const current_path = this.props.path;

        // console.log(current_path);

        return (
            <nav className="nav flex-column left-sidebar pt-4">
              <Link className={"nav-item nav-link" + (current_path == '/admin/dashboard' ? ' active' : '')} to="dashboard">
                  <em className="fa fa-tachometer-alt mr-2"></em>
                  <span>Dashboard</span>
              </Link>
              <Link className={"nav-item nav-link" + (current_path == '/admin/users' ? ' active' : '')} to="users">
                  <em className="fa fa-users mr-2"></em>
                  <span>Users</span>
              </Link>
              <Link className={"nav-item nav-link" + (current_path == '/admin/permissions' ? ' active' : '')} to="permissions">
                  <em className="fa fa-user-shield mr-2"></em>
                  <span>Permissions</span>
              </Link>
              <Link className={"nav-item nav-link" + (current_path == '/admin/settings' ? ' active' : '')} to="settings">
                  <em className="fa fa-cogs mr-2"></em>
                  <span>Settings</span>
              </Link>
            </nav>
        );
    }
}
