import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import store from './core/store'
import Routes from './core/routes'
import * as action from './core/store/actions'

import {AuthService} from './core/services'


store.dispatch(action.authCheck());

// Check if access token in localstorage is present and check if authenticated
if (localStorage.getItem('access_token')) {
	store.dispatch(AuthService.checkAuth());	
}

store.subscribe(() => {
  // console.log(store.getState());
});


render(
    <Provider store={store}>
        <Routes/>
    </Provider>,
    document.getElementById('app')
);