import React from 'react'
import {connect} from 'react-redux'
import {APP} from './common/constants'

class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        const {title} = this.props.children.props || '';

        if (title) {
            document.title = title + " - " + APP.NAME;
        } else {
            document.title = APP.NAME;
        }

        return (
            <main>
                {this.props.children}
            </main>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.Auth.isAuthenticated
    }
};

export default connect(mapStateToProps)(Main);
