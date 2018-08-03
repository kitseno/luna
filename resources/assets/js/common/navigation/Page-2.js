/**
 * Created by Sumit-Yadav on 06-10-2017.
 */
import React from 'react'
import {NavLink, Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
    Button,
    Container,
    Dropdown,
    Divider,
    Image,
    Menu,
    Responsive,
    Segment,
    Grid,
    Item,
} from 'semantic-ui-react';
// import * as actions from '../../store/actions'
import { logout } from '../../services/AuthService'
import {APP} from '../constants'


class Page extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        event.preventDefault();
        // this.props.dispatch(actions.authLogout());
        this.props.dispatch(logout());
    }

    render() {
        this.avatar = (
            <span>
              <Image avatar src={require('../../../images/avatar/boy.png')} verticalAlign="middle"/>{this.props.userName}
            </span>
        );
        return (
            <div>
                <Responsive maxWidth={768} className="mobile-navbar">
                    <Menu size="large" secondary>
                        <Menu.Item as={Link} to="/" className="logo" replace>

                        </Menu.Item>
                        <Menu.Menu position="right">
                            <Menu.Item>
                                <Dropdown icon="bars" className="collapsible-menu">
                                    <Dropdown.Menu>
                                        {this.props.isAuthenticated
                                            ?
                                            <Dropdown.Item onClick={this.handleLogout} text="logout" icon='sign out'
                                                           key='logout'/>
                                            :
                                            <div>
                                                <Dropdown.Item as={NavLink} to="/login" text="login"/>
                                                <Divider/>
                                                <Dropdown.Item as={NavLink} to="/register" text="register"/>
                                            </div>
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                </Responsive>
                <Responsive style={{marginBottom: '0', borderRadius: '0', padding: '1em', border: 'none'}}
                            className="navbar" minWidth={769}>
                      <Menu size='tiny' secondary fluid>
                              <Menu.Item as={Link} to="/" className="logo" replace>{APP.NAME}</Menu.Item>
                              <Menu.Menu position='right'>
                                  {this.props.isAuthenticated
                                      ? <Dropdown item trigger={this.avatar} pointing="top right">
                                          <Dropdown.Menu>
                                              <Dropdown.Item
                                                  text={"Signed in as " + this.props.userName}
                                                  disabled key='user'/>
                                              <Divider fitted/>
                                              <Dropdown.Item as={NavLink} to="/admin/account" text="Account" icon='user'/>
                                              { this.props.isAdmin ?
                                                  <Dropdown.Item as={NavLink} to="/admin" text="Admin" icon='settings'/>
                                                :
                                                  <Divider fitted/>
                                              }
                                              <Dropdown.Item onClick={this.handleLogout} text="Sign out" icon='sign out'
                                                             key='logout'/>
                                          </Dropdown.Menu>
                                        </Dropdown>
                                      : <Button.Group>
                                          <Button as={Link} to="/login" replace positive compact
                                                  style={{lineHeight: '2.5em'}}>Login</Button>
                                          <Button as={Link} to="/register" replace color='blue' compact
                                                  style={{lineHeight: '2.5em'}}>Register</Button>
                                        </Button.Group>

                                  }
                              </Menu.Menu>
                      </Menu>
                </Responsive>
            </div>
        );
    }
}

Page.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default Page;
