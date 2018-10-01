import {combineReducers} from 'redux'
import Auth from './Auth'
import User from './User'
import persistStore from './persistStore'

const RootReducer = combineReducers({Auth, User, persistStore});

export default RootReducer;