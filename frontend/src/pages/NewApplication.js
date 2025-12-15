import React from 'react';
import { Container, Typography } from '@mui/material';

const NewApplication = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Nouvelle Demande
      </Typography>
      <Typography>Formulaire dynamique à implémenter</Typography>
    </Container>
  );
};

export default NewApplication;
