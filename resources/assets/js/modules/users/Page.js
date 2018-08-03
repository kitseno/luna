import React from 'react'
import _ from 'lodash'

import {
        Button,
      } from "@blueprintjs/core"

import Admin from '../../layouts/admin'
import {UserService} from '../../services'

class Page extends React.Component {
    constructor(props) {
        super(props);

        // if (this.props.user.id) {

        //     this.props
        //         .dispatch( UserService.getUserById(this.props.user.id) )
        //         .catch(({error, statusCode}) => {
        //             console.log(error)
        //         })

        // }
        const user = this.props.user.toJson();

        const users = [];

        for (var i = 0; i < 8; i++) {
          var random = [...Array(10)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
          users.push({ id: 1, name: random, email: random });
        }

        this.state = {
            users: users,
            user,
            loading: false,
        }
    }

    componentDidMount() {
        const { dispatch } = this.props

        this.setState({ loading: true });

        dispatch(UserService.getUsers())
            .then((result)  => {
                // console.log(result);
                this.setState({
                    users: result.data
                });
                this.setState({ loading: false });
            })
            .catch(({error, statusCode}) => {
                console.log(error)
            })
    }

    componentWillReceiveProps(nextProps) {
        const user = nextProps.user.toJson();
        
        if (!_.isEqual(this.state.user, user)) {
          this.setState({ user })
        }
        
    }

    render() {

        return (
            <Admin path={this.props.location.pathname}>

                <div className="card table-responsive-sm">
                    <div className="card-body">
                        <h5 className="card-title">Users</h5>
                    </div>
                    <table className="table table-sm table-hover table-striped mb-0">
                        <thead>
                            <tr>
                                <th><span className={this.state.loading ? 'bp3-skeleton' : ''}>ID</span></th>
                                <th><span className={this.state.loading ? 'bp3-skeleton' : ''}>Name</span></th>
                                <th><span className={this.state.loading ? 'bp3-skeleton' : ''}>Action</span></th>
                            </tr>
                        </thead>

                        <tbody>                        
                        {this.state.users && this.state.users.map((user, key) => {
                            return (
                                <tr key={key}>
                                    <td><span className={this.state.loading ? 'bp3-skeleton' : ''}>{user.id}</span></td>
                                    <td><span className={this.state.loading ? 'bp3-skeleton' : ''}>{user.name} <small className={this.state.loading ? 'bp3-skeleton' : ''}>{user.email}</small></span></td>
                                    <td><Button className={this.state.loading ? 'bp3-skeleton' : ''}>Edit</Button></td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
                
            </Admin>
        );
    }
}

export default Page;
