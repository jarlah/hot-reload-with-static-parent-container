import { createStore } from 'redux';
import reducer from '../reducer';

const store = createStore(reducer);

if(module.hot) {
    module.hot.accept('../reducer', () => {
        const nextReducer = require('../reducer').default;
        store.replaceReducer(nextReducer);
    });
}

export default store;