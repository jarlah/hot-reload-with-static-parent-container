import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SimpleSubject from 'simple-subject';

const appSubject$ = new SimpleSubject();

const StaticParentContainer: React.FC = ({ children }) => {
	return (
		<div>
			<div>Should never remount</div>
			<div>For ex an auth container</div>
			<div>{children}</div>
		</div>
	);
};

const Rerenderer: React.FC = () => {
	const [component, setComponent] = useState(<App />)
	useEffect(() => {
		console.log("Mounting");
		const subscription = appSubject$.subscribe((Val) => {
			setComponent(<Val />);
		});
		return () => {
			console.log("Unmounting");
			subscription.unsubscribe();
		}
	}, []);

	if (!component) {
		console.log("No Component");
		return <></>;
	}

	return <div>{component}</div>;
};

ReactDOM.render(
  <React.StrictMode>
    <StaticParentContainer><Rerenderer /></StaticParentContainer>
  </React.StrictMode>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
	appSubject$.notify(NextApp);
  });
}