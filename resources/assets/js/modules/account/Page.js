import React from 'react'
import ReeValidate from 'ree-validate'
import _ from 'lodash'

import Admin from '../../layouts/admin'
// import {UserService} from '../../services'

class Page extends React.Component {
    constructor(props) {
        super(props);

        const user = this.props.user.toJson();

        this.state = {
            user,
        }

    }

    componentWillReceiveProps(nextProps) {
        const user = nextProps.user.toJson();

        if (!_.isEqual(this.state.user, user)) {
          this.setState({ user });
        }
    }

    render() {
        return (
            <Admin>
                <h3>Account</h3>
            </Admin>
        );
    }
}

export default Page;
