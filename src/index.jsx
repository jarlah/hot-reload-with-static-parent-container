import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SimpleSubject from 'simple-subject';
import store from './store';
import { Provider } from 'react-redux';

const appSubject$ = new SimpleSubject();

const StaticParentContainer = ({ children }) => {
	return (
		<div>
			<div>Should never remount</div>
			<div>(for ex an auth container that keeps a session needs to work like this)</div>
			<div>{children}</div>
		</div>
	);
};

const Rerenderer = ({ store }) => {
	const [component, setComponent] = useState(<App />);

	useEffect(() => {
		const subscription = appSubject$.subscribe((NextApp) => {
			setComponent(<NextApp />);
		});
		return () => {
			subscription.unsubscribe();
		}
	}, [store]);

	return <div>{component}</div>;
};

ReactDOM.render(
  <React.StrictMode>
    <StaticParentContainer>
		<Provider store={store}>
			<Rerenderer />
		</Provider>
	</StaticParentContainer>
  </React.StrictMode>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
	appSubject$.notify(NextApp);
  });
}