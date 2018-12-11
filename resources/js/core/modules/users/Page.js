import React from 'react'
import {NavLink, Link} from 'react-router-dom'

import _ from 'lodash'

import {
        Dialog,
        Button,
        FormGroup,
        InputGroup,
      } from "@blueprintjs/core"

import Admin from '../../layouts/admin'
import {UserService, RoleService} from '../../services'

import Pagination from "react-js-pagination"

import moment from "moment"

import { Toast } from '../../common/toaster'
import NumberFormat from '../../common/NumberFormat'

class Page extends React.Component {

    constructor(props) {
        super(props);

        const users = [];

        for (var i = 0; i < 10; i++) {
          var random = [...Array(10)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
          users.push({ id: 1, first_name: random, last_name: random, email: random });
        }

        this.state = {
            users: users,
            pagination: {},
            loading: false,
            removeDialog: false,
            revokeDialog: false,
            restoreDialog: false,
            createUserDialogShown: false,
            editUserDialogShown: false,
            removeUserName: null,
            restoreUserName: null,
            createUserError: null,
            togglePassword: true,
            searchResult: [],

            roles: [],

            editUserForm: {},
        }

        this.handleCreateUser = this.handleCreateUser.bind(this);
        this.handleUpdateUser = this.handleUpdateUser.bind(this);
    }

    componentDidMount() {
        this.fetchUsers();
        this._mounted = true;
    }

    componentWillUnmount() {
       this._mounted = false;
    }

    componentWillReceiveProps(nextProps) {
    }


    fetchUsers(page = '') {

        const { dispatch } = this.props

        const url = new URL(document.location);

        if (page) url.searchParams.set("page", page);
        page = url.searchParams.get("page");

        history.pushState(null, '', url.href);

        this.setState({ loading: true });

        dispatch(UserService.getUsers(page))
            .then((result)  => {
                // console.log(result);
                if (this._mounted) {

                    this.setState({
                        users: result.data.data,
                        activeUsers: result.data.meta.activeUsers,
                        totalUsers: result.data.meta.totalUsers,
                        newUsersToday: result.data.meta.newUsersToday,
                        pagination: {
                            links: result.links,
                            meta: result.meta,
                        }
                    });

                    this.setState({ loading: false });
                }
            })
            .catch(({error, statusCode}) => {
                console.log(error)
            })
    }

    showRemoveDialog(id, name) {
        this.setState({removeDialog: true, removeUserId: id, removeUserName: name});
    }

    showRevokeDialog(id, name) {
        this.setState({revokeDialog: true, revokeUserId: id, revokeUserName: name});
    }

    removeUser(id) {

        const { dispatch } = this.props

        dispatch(UserService.removeUser(id))
            .then( (res) => {
                // console.log(res);
                this.fetchUsers();
                this.dialogClose();
                Toast.show({message: res.message, icon: "trash", intent: "success"});
            })
            .catch( ({error, statusCode}) => {
                this.dialogClose();
                Toast.show({message: error.message, icon: "trash", intent: "warning"});
            })
    }

    restoreUser(id) {
        const { dispatch } = this.props

        dispatch(UserService.restoreUser(id))
            .then( (res) => {
                this.fetchUsers();
                this.restoreDialogClose();
                Toast.show({message: res.message, icon: "tick", intent: "success"});
            })
            .catch( ({error, statusCode}) => {
                this.restoreDialogClose();
                Toast.show({message: error.message, icon: "cross", intent: "warning"});
            })
    }

    revokeUserAccess(id) {

        const { dispatch } = this.props

        dispatch(UserService.revokeUserAccess(id))
            .then( (res) => {
                // console.log(res);
                this.fetchUsers();
                this.setState({revokeDialog: false})
                Toast.show({message: "Successfully revoked access for "+res.first_name+"!", icon: "log-out", intent: "success"});
            })
            .catch( ({error, statusCode}) => {
                Toast.show({message: error.message, icon: "cross", intent: "warning"});
            })
    }

    showRestoreDialog(id, name) {
        this.setState({restoreDialog: true, restoreUserId: id, restoreUserName: name});
    }

    showCreateUserDialog() {

            const { dispatch } = this.props

            dispatch(RoleService.getRoles())
                .then((res)  => {
                    this.setState({
                        roles: res.roles.data,
                    });
                    this.setState({createUserDialogShown: true});
                })
                .catch(({error, statusCode}) => {
                    // console.log(error)
                })
    }

    // Create User

    handleCreateUser(event) {

        event.preventDefault();
        //

        const form = event.target;
        const data = new FormData(form);
        let formData = {};

        for (let key of data.keys()) {
            formData[key] = form.elements[key].value;
        }

        this.props
        .dispatch(UserService.create(formData))
            .then((res)  => {

                this.fetchUsers();
                this.setState({createUserDialogShown: false});
                Toast.show({message: "Successfully created new user "+res.user.first_name+" ("+res.user.email+").", icon: "tick", intent: "success"});
            })
            .catch(({error, statusCode}) => {
                
                if (statusCode == 403) {
                    Toast.show({message: error.message, icon: "warning", intent: "warning"});
                } else if (statusCode == 422) {
                    this.setState({createUserError: error.errors});
                }

            })
    }

    // Update User

    handleUpdateUser(event) {

        event.preventDefault();
        //

        const form = event.target;
        const data = new FormData(form);
        let formData = {};

        for (let key of data.keys()) {
            formData[key] = form.elements[key].value;
        }

        this.props
        .dispatch(UserService.update(formData))
            .then((res)  => {

                this.fetchUsers();
                this.setState({editUserDialogShown: false});
                Toast.show({message: "Successfully updated new user "+res.user.first_name+" ("+res.user.email+").", icon: "tick", intent: "success"});
            })
            .catch(({error, statusCode}) => {
                
                if (statusCode == 403) {
                    Toast.show({message: error.message, icon: "warning", intent: "warning"});
                } else if (statusCode == 422) {
                    this.setState({editUserError: error.errors});
                }

            })
    }

    openEditUserDialog(user) {
        this.setState({editUserForm: user}, () => {

            const { dispatch } = this.props

            dispatch(RoleService.getRoles())
                .then((res)  => {
                    this.setState({
                        roles: res.roles.data,
                    });
                    this.setState({editUserDialogShown: true});
                })
                .catch(({error, statusCode}) => {
                    // console.log(error)
                })
        });
    }

    // Handle Search

    handleSearch = (keyword) => { 
        
        this.setState({ loading: true });

        this.props
        .dispatch(UserService.search(keyword))
            .then((res)  => {
                // console.log(res);

                this.setState({
                    users: res.data.data,
                    activeUsers: res.data.meta.activeUsers,
                    totalUsers: res.data.meta.totalUsers,
                    newUsersToday: res.data.meta.newUsersToday,
                    pagination: {
                        links: res.links,
                        meta: res.meta,
                    }
                }, function () {
                    this.setState({ loading: false });
                });

            })
            .catch(({error, statusCode}) => {
                
                if (statusCode == 403) {
                    Toast.show({message: error.message, icon: "warning", intent: "warning"});
                } else if (statusCode == 422) {
                    //
                }

            })
        
        if (keyword.length == 0) {
            this.fetchUsers();
        }
    
    }

    dialogClose() {
        this.setState({removeDialog: false, removeUserId: null, removeUserName: null});
    }

    restoreDialogClose() {
        this.setState({restoreDialog: false, restoreUserId: null, restoreUserName: null});
    }

    render() {

        const createUserDialog = (
            <Dialog
                title="Create user"
                isOpen={this.state.createUserDialogShown}
                onClose={ () => {this.setState({createUserDialogShown: false})} }
                canEscapeKeyClose="false"
                canOutsideClickClose="false"
                isCloseButtonShown="false">
                <form onSubmit={this.handleCreateUser} noValidate autoComplete="off">
                    <div className="bp3-dialog-body">
                        <div className="row">
                            <div className="col-7">
                                <FormGroup
                                    helperText={this.state.createUserError && this.state.createUserError.first_name}
                                    labelFor="first_name"
                                    intent='danger'
                                    className="mb-1"
                                >
                                    <InputGroup intent={(this.state.createUserError && this.state.createUserError.first_name? 'danger':'')} id="first_name" name="first_name" placeholder="First name (required)" />
                                </FormGroup>

                                <FormGroup
                                    helperText={this.state.createUserError && this.state.createUserError.last_name}
                                    labelFor="last_name"
                                    intent='danger'
                                    className="mb-1"
                                >
                                    <InputGroup intent={(this.state.createUserError && this.state.createUserError.last_name? 'danger':'')} id="last_name" name="last_name" placeholder="Last name (required)" />
                                </FormGroup>

                                <FormGroup
                                    helperText={this.state.createUserError && this.state.createUserError.email}
                                    labelFor="email"
                                    intent='danger'
                                    className="mb-1"
                                >
                                    <InputGroup intent={(this.state.createUserError && this.state.createUserError.email? 'danger':'')} id="email" name="email" placeholder="E-mail address (required)" />
                                </FormGroup>

                                <FormGroup
                                    helperText={this.state.createUserError && this.state.createUserError.password}
                                    labelFor="password"
                                    intent='danger'
                                    className="mb-1"
                                >
                                    <InputGroup
                                        intent={(this.state.createUserError && this.state.createUserError.password? 'danger':'')}
                                        type={this.state.togglePassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        placeholder="Password (required)"
                                        rightElement={
                                                <button
                                                type="button"
                                                tabIndex="-1"
                                                onClick={() => {this.setState({togglePassword: !this.state.togglePassword})}}
                                                className={'bp3-button bp3-minimal bp3-intent-warning '+ (this.state.togglePassword ? 'bp3-icon-eye-open' : 'bp3-icon-eye-off')}>
                                                </button>
                                            }
                                    />
                                </FormGroup>
                            </div>
                            <div className="col-5">
                                <FormGroup
                                    helperText={this.state.createUserError && this.state.createUserError.role}
                                    labelFor="role"
                                    intent='danger'
                                    className="mb-1"
                                >
                                    <div className="bp3-select bp3-intent-danger">
                                      <select defaultValue="" name="role">
                                        <option value="" disabled>Choose a role...</option>
                                        {
                                            this.state.roles &&

                                            this.state.roles.map( (role, key) => {
                                                if (role.name != 'Super-admin') {
                                                    return (<option key={key} value={role.id}>{role.name}</option>)
                                                }
                                            })
                                        }
                                      </select>
                                    </div>
                                </FormGroup>
                            </div>
                        </div>
                    </div>
                    <div className="bp3-dialog-footer">
                        <div className="bp3-dialog-footer-actions">
                            <button type="submit" className="bp3-button">Submit</button>
                            <button type="button" className="bp3-button bp3-intent-primary bg-primary" onClick={ () => {this.setState({createUserDialogShown: false})} }>Cancel</button>
                        </div>
                    </div>
                </form>
            </Dialog>
        );

        const editUserDialog = (
            <Dialog
                title="Edit user"
                isOpen={this.state.editUserDialogShown}
                onClose={ () => {this.setState({editUserDialogShown: false})} }
                canEscapeKeyClose="false"
                canOutsideClickClose="false"
                isCloseButtonShown="false">
                <form onSubmit={this.handleUpdateUser} noValidate autoComplete="off">
                    <input type="hidden" defaultValue={this.state.editUserForm.id} name="id" />
                    <div className="bp3-dialog-body">
                        <div className="row">
                            <div className="col-7">
                                <FormGroup
                                    helperText={this.state.editUserError && this.state.editUserError.first_name}
                                    labelFor="first_name"
                                    intent='danger'
                                    className="mb-1"
                                >
                                    <InputGroup defaultValue={this.state.editUserForm.first_name} intent={(this.state.editUserError && this.state.editUserError.first_name? 'danger':'')} id="first_name" name="first_name" placeholder="First name (required)" />
                                </FormGroup>

                                <FormGroup
                                    helperText={this.state.editUserError && this.state.editUserError.last_name}
                                    labelFor="last_name"
                                    intent='danger'
                                    className="mb-1"
                                >
                                    <InputGroup defaultValue={this.state.editUserForm.last_name} intent={(this.state.editUserError && this.state.editUserError.last_name? 'danger':'')} id="last_name" name="last_name" placeholder="Last name (required)" />
                                </FormGroup>

                                <FormGroup
                                    helperText={this.state.editUserError && this.state.editUserError.email}
                                    labelFor="email"
                                    intent='danger'
                                    className="mb-1"
                                >
                                    <InputGroup defaultValue={this.state.editUserForm.email} intent={(this.state.editUserError && this.state.editUserError.email? 'danger':'')} id="email" name="email" placeholder="E-mail address (required)" />
                                </FormGroup>

                                <FormGroup
                                    helperText={this.state.editUserError && this.state.editUserError.password}
                                    labelFor="password"
                                    intent='danger'
                                    className="mb-1"
                                >
                                    <InputGroup
                                        intent={(this.state.editUserError && this.state.editUserError.password? 'danger':'')}
                                        type={this.state.togglePassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        defaultValue={this.state.editUserForm.password}
                                        placeholder="Change Password (optional)"
                                        rightElement={
                                                <button
                                                type="button"
                                                tabIndex="-1"
                                                onClick={() => {this.setState({togglePassword: !this.state.togglePassword})}}
                                                className={'bp3-button bp3-minimal bp3-intent-warning '+ (this.state.togglePassword ? 'bp3-icon-eye-open' : 'bp3-icon-eye-off')}>
                                                </button>
                                            }
                                    />
                                </FormGroup>
                            </div>
                            <div className="col-5">
                                <FormGroup
                                    helperText={this.state.editUserError && this.state.editUserError.role}
                                    labelFor="role"
                                    intent='danger'
                                    className="mb-1"
                                >
                                    <div className="bp3-select bp3-intent-danger">
                                      <select defaultValue={this.state.editUserForm.roles && this.state.editUserForm.roles[0].id} name="role">
                                        <option value="" disabled readOnly>Choose a role...</option>
                                        {
                                            this.state.roles &&

                                            this.state.roles.map( (role, key) => {
                                                if (role.name != 'Super-admin') {
                                                    return (<option key={key} value={role.id}>{role.name}</option>)
                                                }
                                            })
                                        }
                                      </select>
                                    </div>
                                </FormGroup>
                            </div>
                        </div>
                    </div>
                    <div className="bp3-dialog-footer">
                        <div className="bp3-dialog-footer-actions">
                            <button type="submit" className="bp3-button">Submit</button>
                            <button type="button" className="bp3-button bp3-intent-primary bg-primary" onClick={ () => {this.setState({editUserDialogShown: false})} }>Cancel</button>
                        </div>
                    </div>
                </form>
            </Dialog>
        );

        const removeDialog = (
            <Dialog title="Remove user"
                    isOpen={this.state.removeDialog}
                    onClose={ () => {this.dialogClose()} }
                    canEscapeKeyClose="false"
                    canOutsideClickClose="false"
                    isCloseButtonShown="false">
                <div className="bp3-dialog-body">
                    <p>Are you sure you want to remove user '{this.state.removeUserName}'?</p>
                </div>
                <div className="bp3-dialog-footer">
                    <div className="bp3-dialog-footer-actions">
                        <button type="button" className="bp3-button" onClick={ () => {this.removeUser(this.state.removeUserId)} }>Remove</button>
                        <button type="submit" className="bp3-button bp3-intent-primary bg-primary" onClick={ () => {this.dialogClose()} }>Cancel</button>
                    </div>
                </div>
            </Dialog>
        );

        const revokeDialog = (
            <Dialog title="Revoke user access"
                    isOpen={this.state.revokeDialog}
                    onClose={ () => {this.setState({revokeDialog: false, revokeUserName: null, revokeUserId: null})} }
                    canEscapeKeyClose="false"
                    canOutsideClickClose="false"
                    isCloseButtonShown="false">
                <div className="bp3-dialog-body">
                    <p>Are you sure you want to revoke access for '{this.state.revokeUserName}'?</p>
                </div>
                <div className="bp3-dialog-footer">
                    <div className="bp3-dialog-footer-actions">
                        <button type="button" className="bp3-button" onClick={ () => {this.revokeUserAccess(this.state.revokeUserId)} }>Revoke</button>
                        <button type="submit" className="bp3-button bp3-intent-primary bg-primary" onClick={ () => {this.setState({revokeDialog: false, revokeUserName: null, revokeUserId: null})} }>Cancel</button>
                    </div>
                </div>
            </Dialog>
        );

        const restoreDialog = (
            <Dialog title="Restore user"
                    isOpen={this.state.restoreDialog}
                    onClose={ () => {this.restoreDialogClose()} }
                    canEscapeKeyClose="false"
                    canOutsideClickClose="false"
                    isCloseButtonShown="false">
                <div className="bp3-dialog-body">
                    <p>Are you sure you want to restore user '{this.state.restoreUserName}'?</p>
                </div>
                <div className="bp3-dialog-footer">
                    <div className="bp3-dialog-footer-actions">
                        <button type="button" className="bp3-button" onClick={ () => {this.restoreUser(this.state.restoreUserId)} }>Restore</button>
                        <button type="submit" className="bp3-button bp3-intent-primary bg-primary" onClick={ () => {this.restoreDialogClose()} }>Cancel</button>
                    </div>
                </div>
            </Dialog>
        );

        return (
            <Admin path={this.props.location.pathname}>
                {this.state.createUserDialogShown && createUserDialog}
                {removeDialog}
                {restoreDialog}
                {this.state.revokeDialog && revokeDialog}
                {this.state.editUserDialogShown && editUserDialog}

                <div className="d-none d-sm-flex row flex-wrap mb-4">
                    <div className="col-lg-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h6>Total Users</h6>
                                <h3 className={this.state.totalUsers ? 'text-muted' : 'd-inline bp3-skeleton'}>{this.state.totalUsers ? <NumberFormat>{this.state.totalUsers}</NumberFormat> : '--'}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h6>New Users</h6>
                                <h3 className="text-muted">{this.state.newUsersToday ? <NumberFormat>{this.state.newUsersToday}</NumberFormat> : '-'}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h6>Active Users</h6>
                                <h3 className="text-muted">{this.state.activeUsers ? <NumberFormat>{this.state.activeUsers}</NumberFormat> : '-'}</h3>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="clearfix mb-3">
                    <h5>Users{this.state.loading && <i className="fas fa-spinner fa-spin text-muted fa-xs ml-2"></i>}</h5>
                    <div className="bp3-input-group float-left">
                      <span className="bp3-icon bp3-icon-search"></span>
                      <input className="bp3-input" type="text" placeholder="Search user" dir="auto" onChange={ (e) => this.handleSearch(e.target.value) } />
                    </div>
                    <span className="text-muted float-left mt-1 ml-2">search result {this.state.pagination.meta ? <NumberFormat>{this.state.pagination.meta.total}</NumberFormat> : ''}</span>
                    <Button className="float-right ml-2 bg-primary" intent="primary" onClick={this.showCreateUserDialog.bind(this)}>Create User</Button>
                </div>

                <div className="card shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title float-left"></h5>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-sm table-hover table-striped mb-0">
                            <thead>
                                <tr>
                                    <th><span className={this.state.loading ? 'bp3-skeleton' : ''}>First name</span></th>
                                    <th><span className={this.state.loading ? 'bp3-skeleton' : ''}>Last name</span></th>
                                    <th><span className={this.state.loading ? 'bp3-skeleton' : ''}>Email</span></th>
                                    <th><span className={this.state.loading ? 'bp3-skeleton' : ''}>Roles</span></th>
                                    <th><span className={this.state.loading ? 'bp3-skeleton' : ''}>Date/time added</span></th>
                                    <th><span className={this.state.loading ? 'bp3-skeleton' : ''}>Action</span></th>
                                </tr>
                            </thead>

                            <tbody>                        
                            {this.state.users && this.state.users.map((user, key) => {
                                return (
                                    <tr key={key}>
                                        <td><span className={this.state.loading ? 'bp3-skeleton' : ''}>{ user.deleted_at ? <span className="text-muted"><del>{user.first_name}</del> (removed)</span> : user.first_name }</span></td>
                                        <td><span className={this.state.loading ? 'bp3-skeleton' : ''}>{ user.deleted_at ? <span className="text-muted"><del>{user.last_name}</del> (removed)</span> : user.last_name }</span></td>
                                        <td><span className={this.state.loading ? 'bp3-skeleton' : ''}>{ user.deleted_at ? <span className="text-muted"><del>{user.email}</del></span> : user.email}</span></td>
                                        <td><span className={this.state.loading ? 'bp3-skeleton' : ''}>{ user.roles && user.roles.map((role, key) => {
                                            return (<span key={key}>{role.name }</span>);
                                        })}</span></td>
                                        <td><span className={this.state.loading ? 'bp3-skeleton' : ''}>{moment(user.created_at).utcOffset(-8).format('MMMM DD, YYYY hh:mma')}</span></td>
                                        <td>
                                            <Button icon="edit" onClick={() => this.openEditUserDialog(user)} className={this.state.loading ? 'bp3-skeleton' : ''}></Button>
                                            {(user.tokens && user.tokens[0]) && <Button intent="warning" className={(user.deleted_at ? 'd-none' : '') +" "+ (this.state.loading ? 'bp3-skeleton' : '')} icon="log-out" onClick={() => { this.showRevokeDialog(user.id, user.first_name) }}></Button>}
                                            <Button intent="danger" className={(user.deleted_at ? 'd-none' : '') +" "+ (this.state.loading ? 'bp3-skeleton' : '')} icon="trash" onClick={() => { this.showRemoveDialog(user.id, user.first_name) }}></Button>
                                            <Button intent="primary" className={(user.deleted_at ? 'bg-primary' : 'd-none') +" "+ (this.state.loading ? 'bp3-skeleton' : '')} icon="redo" onClick={() => { this.showRestoreDialog(user.id, user.first_name) }}></Button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                    {this.state.pagination.meta &&
                        <div className="container-fluid">
                            <div className="float-left text-muted align-middle mt-4">
                                <small>{this.state.pagination.meta.current_page} / {this.state.pagination.meta.last_page}</small>
                            </div>
                            <Pagination
                                innerClass="pagination justify-content-end mt-4 float-right pagination-sm"
                                itemClass="page-item"
                                linkClass="page-link"
                                prevPageText="Previous"
                                nextPageText="Next"
                                firstPageText="First"
                                lastPageText="Last"
                                activePage={this.state.pagination.meta.current_page}
                                itemsCountPerPage={this.state.pagination.meta.per_page}
                                totalItemsCount={this.state.pagination.meta.total}
                                pageRangeDisplayed={3}
                                onChange={this.fetchUsers.bind(this)}
                            />
                        </div>
                    }
                </div>
                
            </Admin>
        );
    }
}

export default Page;
