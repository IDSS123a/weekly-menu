import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Typography, CircularProgress } from '@material-ui/core';
import { processMenuFile } from '../services/menuService';

function UploadScreen() {
  const { institution } = useParams();
  const history = useHistory();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setError('');
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      setError('Please choose a file smaller than 10MB.');
      setFile(null);
      return;
    }
    setFile(selectedFile || null);
  };

  const handleUpload = async () => {
    if (!file) {
      window.alert('Please select a file first!');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const menuData = await processMenuFile(file, institution);
      history.push(`/display/${institution}`, { menuData });
    } catch (uploadError) {
      setError(uploadError.message || 'Something went wrong while processing the file.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Typography variant="h4">Upload Menu for {institution.toUpperCase()}</Typography>
      <input type="file" accept=".docx,.pdf" onChange={handleFileChange} style={{ margin: '20px 0' }} />
      <div style={{ marginBottom: '10px' }}>
        <Typography variant="body2" color="textSecondary">
          Supported formats: DOCX, PDF (max 10MB)
        </Typography>
      </div>
      <Button variant="contained" color="primary" onClick={handleUpload} disabled={!file || isProcessing}>
        {isProcessing ? (
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <CircularProgress size={20} color="inherit" style={{ marginRight: '10px' }} />
            Processing...
          </span>
        ) : (
          'Start AI Processing'
        )}
      </Button>
      {error ? (
        <Typography variant="body2" color="error" style={{ marginTop: '15px' }}>
          {error}
        </Typography>
      ) : null}
    </div>
  );
}

export default UploadScreen;
