import React from 'react';
import { Container, Typography } from '@mui/material';

const ApplicationDetail = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Détails de la Demande
      </Typography>
    </Container>
  );
};

export default ApplicationDetail;
