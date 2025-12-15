import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Alert,
  Chip
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const RoleManagement = () => {
  const [roles, setRoles] = useState([
    {
      id: '1',
      name: 'SYSTEM_ADMIN',
      description: 'Administrateur système avec accès complet',
      is_system_role: true,
      user_count: 1
    }
  ]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Gestion des Rôles
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {/* TODO: Open dialog */}}
        >
          Nouveau Rôle
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Les rôles sont entièrement dynamiques. Créez des rôles selon les besoins de votre organisation
        (ex: Patrimoine, DCRTCT, Agent Accueil, Validateur, etc.)
      </Alert>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Rôles Existants
        </Typography>

        {roles.map((role) => (
          <Box
            key={role.id}
            sx={{
              p: 2,
              mb: 2,
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6">{role.name}</Typography>
                {role.is_system_role && (
                  <Chip label="Système" size="small" color="primary" />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {role.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {role.user_count} utilisateur(s)
              </Typography>
            </Box>
            {!role.is_system_role && (
              <Box>
                <Button size="small" sx={{ mr: 1 }}>
                  Modifier
                </Button>
                <Button size="small" color="error">
                  Supprimer
                </Button>
              </Box>
            )}
          </Box>
        ))}

        <Alert severity="warning" sx={{ mt: 2 }}>
          <strong>Exemples de rôles à créer :</strong>
          <ul>
            <li><strong>Patrimoine</strong> - Service Patrimoine - Gestion des demandes</li>
            <li><strong>DCRTCT</strong> - Direction Centrale - Validation finale</li>
            <li><strong>Agent Accueil</strong> - Agent d'accueil - Réception des demandes</li>
            <li><strong>Validateur</strong> - Validateur - Vérification des documents</li>
          </ul>
        </Alert>
      </Paper>
    </Container>
  );
};

export default RoleManagement;
