import React from 'react'
import {connect} from 'react-redux'
import {APP} from './core/common/constants'

import { AbilityContext } from './core/utils/casl/ability-context'
import ability from './core/utils/casl/ability'

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
                <AbilityContext.Provider value={ability}>
                {this.props.children}
                </AbilityContext.Provider>
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
