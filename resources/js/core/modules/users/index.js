import {connect} from 'react-redux'
import User from '../../models/User'

// import component
import Page from './Page'

const mapStateToProps = state => {

    return {
        user: new User(state.Auth.user),
    }
};

export default connect(mapStateToProps)(Page)