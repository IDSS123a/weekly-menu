import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';

function UploadScreen() {
	const { institution } = useParams();
	const history = useHistory();
	const [file, setFile] = useState(null);

	const handleFileChange = (event) => {
		setFile(event.target.files[0]);
	};

	const handleUpload = () => {
		if (file) {
			// Placeholder for AI processing
			history.push(`/display/${institution}`);
		} else {
			window.alert('Please select a file first!');
		}
	};

	return (
		<div style={{ padding: '20px', textAlign: 'center' }}>
			<Typography variant="h4">Upload Menu for {institution.toUpperCase()}</Typography>
			<input
				type="file"
				accept=".docx,.pdf"
				onChange={handleFileChange}
				style={{ margin: '20px 0' }}
			/>
			<Button variant="contained" color="primary" onClick={handleUpload}>
				Process Menu
			</Button>
		</div>
	);
}

export default UploadScreen;
