import {createStore} from 'redux';
import {coreReducer} from './reducers';

const store = createStore(coreReducer);

export default store;
