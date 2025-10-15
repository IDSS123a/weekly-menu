import React from 'react';
import { Route, Switch } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import UploadScreen from './components/UploadScreen';
import MenuDisplay from './components/MenuDisplay';

function App() {
	return (
		<Switch>
			<Route exact path="/" component={WelcomeScreen} />
			<Route path="/upload/:institution" component={UploadScreen} />
			<Route path="/display/:institution" component={MenuDisplay} />
		</Switch>
	);
}

export default App;
