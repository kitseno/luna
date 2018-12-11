// import libs
import {connect} from 'react-redux'

// import component
import Page from './Page'

const mapStateToProps = state => {

    return {
        isAuthenticated : state.Auth.isAuthenticated,
        isAdmin : state.Auth.isAdmin,
        userName : state.Auth.user.first_name,
        userAvatar : '/avatars/'+state.Auth.user.avatar,
    }
};

export default connect(mapStateToProps)(Page)