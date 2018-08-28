import React from 'react'
import {NavLink, Link} from 'react-router-dom'

import _ from 'lodash'

import {
        Dialog,
        Button,
      } from "@blueprintjs/core"

import Admin from '../../layouts/admin'
import {UserService} from '../../services'

import Pagination from "react-js-pagination"

import moment from "moment"

import { Toast } from '../../common/toaster'

class Page extends React.Component {

    constructor(props) {
        super(props);

        const users = [];

        for (var i = 0; i < 5; i++) {
          var random = [...Array(5)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
          users.push({ id: 1, name: random, email: random });
        }

        this.state = {
            users: users,
            pagination: {},
            loading: false,
            removeDialog: false,
            restoreDialog: false,
            removeUserName: null,
            restoreUserName: null,
        }

        
    }

    componentWillMount() { 
        this.fetchUsers();
    }


    componentWillReceiveProps(nextProps) {
    }


    fetchUsers(page = '') {

        const { dispatch } = this.props
        if (page) this.props.history.push('?page='+page);

        const { search } = this.props.history.location
        if (search) page = search.split('=')[1];

        this.setState({ loading: true });

        dispatch(UserService.getUsers(page))
            .then((result)  => {
                // console.log(result);
                this.setState({
                    users: result.data.data,
                    pagination: {
                        links: result.links,
                        meta: result.meta,
                    }
                });
                this.setState({ loading: false });
            })
            .catch(({error, statusCode}) => {
                console.log(error)
            })
    }

    showRemoveDialog(id, name) {
        this.setState({removeDialog: true, removeUserId: id, removeUserName: name});
    }

    removeUser(id) {

        const { dispatch } = this.props

        dispatch(UserService.removeUser(id))
            .then( (res) => {
                // console.log(res);
                this.fetchUsers();
                this.dialogClose();
                Toast.show({message: "Successfully removed "+res.name+"!", icon: "trash", intent: "warning"});
            })
            .catch( ({error, statusCode}) => {
                console.log(error)
            })
    }

    showRestoreDialog(id, name) {
        this.setState({restoreDialog: true, restoreUserId: id, restoreUserName: name});
    }

    restoreUser(id) {
        const { dispatch } = this.props

        dispatch(UserService.restoreUser(id))
            .then( (res) => {
                // console.log(res);
                this.fetchUsers();
                this.restoreDialogClose();
                Toast.show({message: "Successfully restored "+res.name+"!", icon: "tick", intent: "success"});
            })
            .catch( ({error, statusCode}) => {
                console.log(error)
            })
    }

    dialogClose() {
        this.setState({removeDialog: false, removeUserId: null, removeUserName: null});
    }

    restoreDialogClose() {
        this.setState({restoreDialog: false, restoreUserId: null, restoreUserName: null});
    }

    render() {

        this.removeDialog = (
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
                        <button type="submit" className="bp3-button bp3-intent-primary" onClick={ () => {this.dialogClose()} }>Cancel</button>
                    </div>
                </div>
            </Dialog>
        );

        this.restoreDialog = (
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
                        <button type="submit" className="bp3-button bp3-intent-primary" onClick={ () => {this.restoreDialogClose()} }>Cancel</button>
                    </div>
                </div>
            </Dialog>
        );

        return (
            <Admin path={this.props.location.pathname}>
                {this.removeDialog}
                {this.restoreDialog}
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title float-left">Users <small className="text-muted">{this.state.pagination.meta && this.state.pagination.meta.total}</small></h5>
                        <div className="bp3-input-group float-right">
                          <span className="bp3-icon bp3-icon-search"></span>
                          <input className="bp3-input" type="search" placeholder="Search user" dir="auto" />
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-sm table-hover table-striped mb-0">
                            <thead>
                                <tr>
                                    <th><span className={this.state.loading ? 'bp3-skeleton' : ''}>ID</span></th>
                                    <th><span className={this.state.loading ? 'bp3-skeleton' : ''}>Name</span></th>
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
                                        <td><span className={this.state.loading ? 'bp3-skeleton' : ''}>{user.id}</span></td>
                                        <td><span className={this.state.loading ? 'bp3-skeleton' : ''}>{ user.deleted_at ? <span className="text-muted"><del>{user.name}</del> (removed)</span> : user.name }</span></td>
                                        <td><span className={this.state.loading ? 'bp3-skeleton' : ''}>{ user.deleted_at ? <span className="text-muted"><del>{user.email}</del></span> : user.email}</span></td>
                                        <td><span className={this.state.loading ? 'bp3-skeleton' : ''}>{ user.roles && user.roles.map((role, key) => {
                                            return (<span key={key}>{role.name }</span>);
                                        })}</span></td>
                                        <td><span className={this.state.loading ? 'bp3-skeleton' : ''}>{moment(user.created_at).utcOffset(-8).format('MMMM DD, YYYY hh:mma')}</span></td>
                                        <td>
                                            <Button icon="edit" className={this.state.loading ? 'bp3-skeleton' : ''}></Button>
                                            <Button intent="danger" className={(user.deleted_at ? 'd-none' : '') +" "+ (this.state.loading ? 'bp3-skeleton' : '')} icon="trash" onClick={() => { this.showRemoveDialog(user.id, user.name) }}></Button>
                                            <Button intent="primary" className={(user.deleted_at ? '' : 'd-none') +" "+ (this.state.loading ? 'bp3-skeleton' : '')} icon="redo" onClick={() => { this.showRestoreDialog(user.id, user.name) }}></Button>
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
                                pageRangeDisplayed={5}
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
