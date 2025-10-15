import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Typography } from '@material-ui/core';

const LOGO_IMH_SRC = `${process.env.PUBLIC_URL || ''}/logo-imh.png`;
const LOGO_IDSS_SRC = `${process.env.PUBLIC_URL || ''}/logo-idss.png`;

function WelcomeScreen() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Typography variant="h4">Welcome to Weekly Menu App</Typography>
      <Typography variant="body1">
        Upload your weekly menu document to generate a formatted schedule for IMH or IDSS.
      </Typography>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={12} sm={6}>
          <Link to="/upload/imh" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary" fullWidth style={{ height: '200px' }}>
              <img src={LOGO_IMH_SRC} alt="IMH Logo" style={{ width: '150px', marginBottom: '10px' }} />
              <Typography variant="h6">Montessori House (IMH)</Typography>
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Link to="/upload/idss" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary" fullWidth style={{ height: '200px' }}>
              <img src={LOGO_IDSS_SRC} alt="IDSS Logo" style={{ width: '150px', marginBottom: '10px' }} />
              <Typography variant="h6">IDSS School</Typography>
            </Button>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
}

export default WelcomeScreen;
