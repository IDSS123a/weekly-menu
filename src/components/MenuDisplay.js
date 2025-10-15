import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';

function MenuDisplay() {
	const { institution } = useParams();

	const handleExport = () => {
		// Placeholder for PDF export
		window.alert('Exporting PDF...');
	};

	const handlePrint = () => {
		window.print();
	};

	return (
		<div style={{ padding: '20px', textAlign: 'center' }}>
			<Typography variant="h4">Weekly Menu for {institution.toUpperCase()}</Typography>
			<div
				style={{
					width: '100%',
					height: 'auto',
					backgroundColor: '#f0f0f0',
					padding: '10px',
				}}
				className="menu-container"
			>
				{/* Placeholder for menu content */}
				<Typography>Menu will be displayed here after processing.</Typography>
			</div>
			<div style={{ marginTop: '20px' }}>
				<Button
					variant="contained"
					color="primary"
					onClick={handleExport}
					style={{ marginRight: '10px' }}
				>
					Export PDF
				</Button>
				<Button variant="contained" color="primary" onClick={handlePrint}>
					Print
				</Button>
			</div>
		</div>
	);
}

export default MenuDisplay;
