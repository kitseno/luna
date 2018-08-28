import {connect} from 'react-redux'
import User from '../../models/User'

// import component
import Page from './Page'

const mapStateToProps = state => {
		
    return {
        user: new User(state.Auth.user),
        checkingAuth: state.Auth.checkingAuth,
    }
};

export default connect(mapStateToProps)(Page)