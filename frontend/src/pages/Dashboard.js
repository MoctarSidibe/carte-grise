import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  IconButton,
  Chip,
} from '@mui/material';
import {
  PendingActions,
  DirectionsCar,
  CheckCircle,
  Cancel,
  TrendingUp,
  AccessTime,
  MoreVert,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, trend, subtitle }) => (
  <Card
    sx={{
      height: '100%',
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      borderLeft: `4px solid ${color}`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: { xs: 'none', md: 'translateY(-4px)' },
        boxShadow: '0px 12px 24px rgba(0,0,0,0.12)',
      },
    }}
  >
    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              color,
              mb: 1,
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
            >
              {subtitle}
            </Typography>
          )}
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingUp sx={{ fontSize: { xs: 14, md: 16 }, color: '#2E7D32', mr: 0.5 }} />
              <Typography
                variant="caption"
                sx={{
                  color: '#2E7D32',
                  fontWeight: 600,
                  fontSize: { xs: '0.7rem', md: '0.75rem' },
                }}
              >
                {trend}
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar
          sx={{
            background: color,
            width: { xs: 48, md: 56 },
            height: { xs: 48, md: 56 },
            boxShadow: `0px 4px 12px ${color}40`,
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: { xs: 24, md: 28 } } })}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const RecentActivity = ({ activities }) => (
  <Paper
    sx={{
      p: 3,
      height: '100%',
      borderRadius: 3,
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h6" fontWeight={600}>
        Activités Récentes
      </Typography>
      <IconButton size="small">
        <MoreVert />
      </IconButton>
    </Box>

    <Box>
      {activities.map((activity, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            py: 2,
            borderBottom: index < activities.length - 1 ? '1px solid #f0f0f0' : 'none',
          }}
        >
          <Avatar
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              width: 40,
              height: 40,
              mr: 2,
            }}
          >
            <DirectionsCar />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              {activity.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {activity.time}
            </Typography>
          </Box>
          <Chip
            label={activity.status}
            size="small"
            sx={{
              background:
                activity.status === 'Approuvée'
                  ? '#E8F5E9'
                  : activity.status === 'En cours'
                  ? '#FFF3E0'
                  : '#FFEBEE',
              color:
                activity.status === 'Approuvée'
                  ? '#2E7D32'
                  : activity.status === 'En cours'
                  ? '#F57C00'
                  : '#D32F2F',
              fontWeight: 600,
            }}
          />
        </Box>
      ))}
    </Box>
  </Paper>
);

const ProgressWidget = () => (
  <Paper
    sx={{
      p: 3,
      height: '100%',
      borderRadius: 3,
      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Gabon Flag Stripe Decoration */}
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        display: 'flex',
      }}
    >
      <Box sx={{ flex: 1, background: '#1976d2' }} />
      <Box sx={{ flex: 1, background: '#42a5f5' }} />
      <Box sx={{ flex: 1, background: '#1565c0' }} />
    </Box>
    <Typography variant="h6" fontWeight={600} gutterBottom>
      Progression du Mois
    </Typography>
    <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
      Objectif: 100 dossiers
    </Typography>

    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2">Traités</Typography>
        <Typography variant="body2" fontWeight={600}>
          73%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={73}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(255,255,255,0.3)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'white',
            borderRadius: 4,
          },
        }}
      />
    </Box>

    <Box sx={{ mt: 4 }}>
      <Typography variant="h3" fontWeight={700}>
        73
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        Dossiers traités ce mois
      </Typography>
    </Box>
  </Paper>
);

const Dashboard = () => {
  const stats = [
    {
      title: 'En Attente',
      value: '24',
      icon: <PendingActions sx={{ fontSize: 28 }} />,
      color: '#F57C00',
      subtitle: 'Nouvelles demandes',
      trend: '+12% cette semaine',
    },
    {
      title: 'En Cours',
      value: '18',
      icon: <AccessTime sx={{ fontSize: 28 }} />,
      color: '#0288D1',
      subtitle: 'En traitement',
    },
    {
      title: 'Approuvées',
      value: '156',
      icon: <CheckCircle sx={{ fontSize: 28 }} />,
      color: '#2E7D32',
      subtitle: 'Ce mois',
      trend: '+8% vs mois dernier',
    },
    {
      title: 'Rejetées',
      value: '7',
      icon: <Cancel sx={{ fontSize: 28 }} />,
      color: '#D32F2F',
      subtitle: 'Documents incomplets',
    },
  ];

  const recentActivities = [
    { title: 'Demande CG-2025-001 soumise', time: 'Il y a 5 minutes', status: 'En cours' },
    { title: 'Demande CG-2025-034 approuvée', time: 'Il y a 1 heure', status: 'Approuvée' },
    { title: 'Demande CG-2025-023 validée', time: 'Il y a 2 heures', status: 'Approuvée' },
    { title: 'Demande CG-2025-045 rejetée', time: 'Il y a 3 heures', status: 'Rejetée' },
    { title: 'Demande CG-2025-012 en validation', time: 'Il y a 4 heures', status: 'En cours' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#f5f5f5',
        py: { xs: 2, md: 4 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
              fontWeight: 700,
            }}
            gutterBottom
          >
            Tableau de Bord
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
          >
            Vue d'ensemble des demandes de carte grise
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>

        {/* Recent Activity & Progress */}
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} lg={8}>
            <RecentActivity activities={recentActivities} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <ProgressWidget />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
