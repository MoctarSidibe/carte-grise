import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Avatar,
  Fade,
  Slide,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  Person,
  DirectionsCar,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.username, formData.password);

    if (!result.success) {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #009E60 0%, #FCD116 50%, #3A75C4 100%)',
        padding: { xs: 1, sm: 2 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gabon Flag Stripes - Decorative Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.15,
          pointerEvents: 'none',
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '33.33%',
          background: '#009E60'
        }} />
        <Box sx={{
          position: 'absolute',
          top: '33.33%',
          left: 0,
          right: 0,
          height: '33.34%',
          background: '#FCD116'
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '33.33%',
          background: '#3A75C4'
        }} />
      </Box>

      <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Slide direction="down" in={true} timeout={800}>
          <Paper
            elevation={24}
            sx={{
              padding: { xs: 2.5, sm: 4, md: 5 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: { xs: 3, md: 4 },
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              width: '100%',
              maxWidth: 500,
            }}
          >
            {/* Gabon Flag Stripe Decoration on Card */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 8,
                display: 'flex',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                overflow: 'hidden',
              }}
            >
              <Box sx={{ flex: 1, background: '#009E60' }} />
              <Box sx={{ flex: 1, background: '#FCD116' }} />
              <Box sx={{ flex: 1, background: '#3A75C4' }} />
            </Box>

            {/* Logo */}
            <Fade in={true} timeout={1200}>
              <Avatar
                sx={{
                  m: 1,
                  mt: { xs: 2, md: 3 },
                  width: { xs: 64, md: 80 },
                  height: { xs: 64, md: 80 },
                  background: 'linear-gradient(135deg, #009E60 0%, #FCD116 50%, #3A75C4 100%)',
                  boxShadow: '0px 8px 24px rgba(0, 158, 96, 0.4)',
                }}
              >
                <DirectionsCar sx={{ fontSize: { xs: 36, md: 48 } }} />
              </Avatar>
            </Fade>

            {/* Title */}
            <Typography
              component="h1"
              sx={{
                mt: 2,
                mb: 1,
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                background: 'linear-gradient(135deg, #009E60 0%, #FCD116 50%, #3A75C4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
              }}
            >
              CGA
            </Typography>

            <Typography
              component="h2"
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
                fontWeight: 500,
                mb: 1,
                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
              }}
            >
              Carte Grise Administrative
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
                mb: 1,
                fontSize: { xs: '0.875rem', md: '1rem' },
              }}
            >
              République Gabonaise
            </Typography>

            {/* Flag Colors Indicator */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                mb: 3,
              }}
            >
              <Box sx={{ width: 24, height: 4, background: '#009E60', borderRadius: 1 }} />
              <Box sx={{ width: 24, height: 4, background: '#FCD116', borderRadius: 1 }} />
              <Box sx={{ width: 24, height: 4, background: '#3A75C4', borderRadius: 1 }} />
            </Box>

            {error && (
              <Fade in={true}>
                <Alert
                  severity="error"
                  sx={{
                    width: '100%',
                    mb: 3,
                    borderRadius: 2,
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: '100%' }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Nom d'utilisateur"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#009E60',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#009E60',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#009E60',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#009E60',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #009E60 0%, #FCD116 50%, #3A75C4 100%)',
                  boxShadow: '0px 8px 24px rgba(0, 158, 96, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #007045 0%, #E8BE0E 50%, #285491 100%)',
                    boxShadow: '0px 12px 32px rgba(0, 158, 96, 0.5)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #009E6080 0%, #FCD11680 50%, #3A75C480 100%)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
            </Box>

            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: '1px solid rgba(0,0,0,0.1)',
                width: '100%',
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ fontSize: '0.85rem' }}
              >
                <strong>Identifiants par défaut :</strong>
                <br />
                admin / Admin@123456
              </Typography>
            </Box>

            {/* Bottom Stripe Decoration */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 6,
                display: 'flex',
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                overflow: 'hidden',
              }}
            >
              <Box sx={{ flex: 1, background: '#009E60' }} />
              <Box sx={{ flex: 1, background: '#FCD116' }} />
              <Box sx={{ flex: 1, background: '#3A75C4' }} />
            </Box>
          </Paper>
        </Slide>
      </Container>
    </Box>
  );
};

export default Login;
