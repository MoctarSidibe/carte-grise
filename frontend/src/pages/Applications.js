import React from 'react';
import { Container, Typography } from '@mui/material';

const Applications = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Demandes
      </Typography>
      <Typography>Liste des demandes à implémenter avec DataGrid</Typography>
    </Container>
  );
};

export default Applications;
