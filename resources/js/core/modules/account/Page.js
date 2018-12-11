import React from 'react'
import moment from "moment"

import Admin from '../../layouts/admin'
import _ from 'lodash'

import {MeService} from '../../services'
import { Toast } from '../../common/toaster'

import '../../common/styles/Account.css'

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
        }
    }

    componentWillReceiveProps(nextProps) {
        const user = nextProps.user.toJson();

        if (!_.isEqual(this.state.user, user)) {
          this.setState({ user });
        }
    }

    handleChangeAvatar = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();

            reader.onload = () => {
                this.setState({forUploadAvatar: reader.result})
            }

            reader.readAsDataURL(e.target.files[0]);
        }
    }

    handleClearForUploadAvatar = () => {
        this.setState({forUploadAvatar: null});
        document.getElementById('avatar').value = null;
    }

    handleUploadAvatar = (e) => {

        e.preventDefault();
        
        const { dispatch } = this.props;

        const formData = new FormData();
        const avatar = document.getElementById('avatar').files[0];

        formData.append('avatar', avatar);

        dispatch(MeService.updateAvatar(formData))
            .then( (res) => {
                if (res.user) {
                    this.handleClearForUploadAvatar();
                    Toast.show({message: res.message, icon: "tick", intent: "success"});
                }
            })
            .catch( ({error, statusCode}) => {
                console.log(error)
            })
    }

    render() {

        return (
            <Admin>
                <h4>Account</h4>
                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-4 d-flex flex-column align-items-center">
                                <form name="formUploadAvatar">
                                <label htmlFor="avatar" className="avatar rounded-circle border mb-0">
                                    {
                                        this.state.user.avatar && 
                                        <img className="align-text-bottom" style={{height: '100%', 'borderWidth': '3px !important'}} src={this.state.forUploadAvatar ? this.state.forUploadAvatar :'/avatars/'+this.state.user.avatar}/>
                                    }
                                    <input type="file" id="avatar" className='d-none' name="avatar" onChange={(e) => this.handleChangeAvatar(e) }/>
                                    <div className='p-2 text-white text-center' style={{position: 'absolute', width: '100%', bottom: '0px', backgroundColor: 'rgba(0,0,0,0.33)'}}>Change Avatar</div>
                                </label>
                                {
                                    this.state.forUploadAvatar && 
                                    <div>
                                        <div className="text-muted text-center"><small>Click upload to save new avatar.</small></div>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <button type="button" className="btn btn-link btn-sm" onClick={this.handleClearForUploadAvatar}>X</button>
                                            <button type="submit" className="btn btn-primary btn-sm" onClick={this.handleUploadAvatar}>Upload Avatar</button>
                                        </div>
                                    </div>
                                }
                                </form>
                            </div>
                            <div className="col-lg-4 d-flex flex-column justify-content-center">
                                <div className="h4 mb-1">{this.props.user.first_name} {this.props.user.last_name}</div>
                                <div className="h4 mb-1 text-primary">{this.props.user.email}</div>
                                <div><small className="text-muted">Member since {this.props.user.created_at && moment(this.props.user.created_at).utcOffset(-8).format('MMMM DD, YYYY hh:mma')}</small></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Admin>
        );
    }
}

export default Page;
