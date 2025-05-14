import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Paper,
  IconButton,
  Theme,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Countdown from 'react-countdown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { TypographyProps } from '@mui/material';
import { useAnalytics } from '../hooks/useAnalytics';

const CoverImage = styled(Box)({
  height: '100vh',
  backgroundImage: 'url("/images/bg.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  color: 'white',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const GradientText = styled(Typography)<TypographyProps>({
  background: 'linear-gradient(45deg, #FF1493, #FF69B4)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  fontFamily: "'Great Vibes', cursive",
  textAlign: 'center',
});

const Section = styled(Box)<{ theme?: Theme }>(({ theme }) => ({
  padding: theme?.spacing(10, 0),
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme?.spacing(5, 0),
  },
}));

const weddingDate = new Date('2025-06-01T09:00:00');

interface CountdownRendererProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isMobile?: boolean;
}

const CountdownBox = ({ value, label, delay, gradient, isMobile }: {
  value: number;
  label: string;
  delay: number;
  gradient: string;
  isMobile?: boolean;
}) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay
    }}
    whileHover={{ scale: 1.05 }}
  >
    <Paper
      elevation={3}
      sx={{
        p: isMobile ? 2 : 3,
        minWidth: isMobile ? 80 : 120,
        textAlign: 'center',
        background: gradient,
        color: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(255,105,180,0.2)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
      }}
    >
      <Typography 
        variant={isMobile ? "h5" : "h3"} 
        sx={{ 
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 600,
          mb: 1,
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {value}
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 500,
          letterSpacing: 1,
          textTransform: 'uppercase',
          fontSize: isMobile ? '0.7rem' : '0.8rem'
        }}
      >
        {label}
      </Typography>
    </Paper>
  </motion.div>
);

const CountdownRenderer = ({ days, hours, minutes, seconds, isMobile }: CountdownRendererProps) => (
  <Box sx={{ 
    display: 'flex', 
    gap: isMobile ? 2 : 3, 
    justifyContent: 'center', 
    flexWrap: 'wrap',
    p: 2
  }}>
    <CountdownBox
      value={days}
      label="Hari"
      delay={0}
      gradient="linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)"
      isMobile={isMobile}
    />
    <CountdownBox
      value={hours}
      label="Jam"
      delay={0.1}
      gradient="linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)"
      isMobile={isMobile}
    />
    <CountdownBox
      value={minutes}
      label="Menit"
      delay={0.2}
      gradient="linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)"
      isMobile={isMobile}
    />
    <CountdownBox
      value={seconds}
      label="Detik"
      delay={0.3}
      gradient="linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)"
      isMobile={isMobile}
    />
  </Box>
);

const EventCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const Home = () => {
  const { trackEvent } = useAnalytics();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/music/kamulah-takdirku.mp3');
    audioRef.current.loop = true;
    
    // Handle audio loaded
    audioRef.current.addEventListener('loadeddata', () => {
      setAudioLoaded(true);
      handleAutoplay();
    });

    // Handle page visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else if (audioLoaded && isPlaying) {
        audioRef.current?.play();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Handle autoplay
  const handleAutoplay = async () => {
    try {
      if (audioRef.current) {
        await audioRef.current.play();
        setIsPlaying(true);
        trackEvent('music_autoplay_success');
        
        // Add user interaction listener only if autoplay fails
        const handleUserInteraction = async () => {
          if (audioRef.current && !isPlaying) {
            await audioRef.current.play();
            setIsPlaying(true);
          }
          // Remove listener after successful play
          ['click', 'touchstart'].forEach(event => 
            document.removeEventListener(event, handleUserInteraction)
          );
        };

        ['click', 'touchstart'].forEach(event => 
          document.addEventListener(event, handleUserInteraction)
        );
      }
    } catch (error) {
      console.log('Autoplay prevented. Waiting for user interaction.');
      setIsPlaying(false);
      trackEvent('music_autoplay_failed');
      
      // Add user interaction listener
      const handleUserInteraction = async () => {
        if (audioRef.current && !isPlaying) {
          try {
            await audioRef.current.play();
            setIsPlaying(true);
            // Remove listener after successful play
            ['click', 'touchstart'].forEach(event => 
              document.removeEventListener(event, handleUserInteraction)
            );
          } catch (error) {
            console.log('Playback failed:', error);
          }
        }
      };

      ['click', 'touchstart'].forEach(event => 
        document.addEventListener(event, handleUserInteraction)
      );
    }
  };

  // Handle play/pause toggle
  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        trackEvent('music_pause');
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        trackEvent('music_play');
      }
    } catch (error) {
      console.log('Playback failed:', error);
    }
  };

  // Update audio play state when isPlaying changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Playback prevented:', error);
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Track map interactions
  const handleMapClick = () => {
    trackEvent('map_click', {
      location: 'The Priangan Boutique Hotel'
    });
  };

  return (
    <Box>
      <CoverImage>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontFamily: "'Montserrat', sans-serif",
                letterSpacing: '4px',
                color: '#FFB6C1'
              }}
            >
              The Wedding of
            </Typography>
            <GradientText 
              variant="h1" 
              sx={{ 
                mb: 4, 
                fontSize: isMobile ? '3rem' : '4.5rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              Naufal Aryasatya
              <br />
              &amp;
              <br />
              Aini Aminah
            </GradientText>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Montserrat', sans-serif",
                letterSpacing: '2px',
                color: '#FFB6C1'
              }}
            >
              1 Juni 2025
            </Typography>
          </motion.div>
        </Container>
      </CoverImage>

      <Section>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GradientText 
              variant="h2" 
              sx={{ 
                mb: 4,
                fontSize: isMobile ? '2.5rem' : '3.5rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Bismillahirrahmanirrahim
            </GradientText>
            
            <Typography 
              variant="h6" 
              paragraph 
              sx={{ 
                mb: 6,
                fontFamily: "'Montserrat', sans-serif",
                color: '#666',
                fontSize: isMobile ? '1rem' : '1.2rem',
                lineHeight: 1.8,
                maxWidth: '800px',
                margin: '0 auto',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                p: 3,
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri pernikahan kami:
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
              gap: 4,
              mt: 4 
            }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 4,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 8px 32px rgba(255,105,180,0.1)',
                  }}
                >
                  <GradientText 
                    variant="h4" 
                    gutterBottom
                    sx={{ 
                      fontSize: isMobile ? '1.8rem' : '2.2rem',
                      mb: 2
                    }}
                  >
                    Naufal Aryasatya
                  </GradientText>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      fontFamily: "'Montserrat', sans-serif",
                      color: '#666',
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      lineHeight: 1.6
                    }}
                  >
                    Putra dari Bapak Aris & Ibu Yeni
                  </Typography>
                </Paper>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 4,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 8px 32px rgba(255,105,180,0.1)',
                  }}
                >
                  <GradientText 
                    variant="h4" 
                    gutterBottom
                    sx={{ 
                      fontSize: isMobile ? '1.8rem' : '2.2rem',
                      mb: 2
                    }}
                  >
                    Aini Aminah
                  </GradientText>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      fontFamily: "'Montserrat', sans-serif",
                      color: '#666',
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      lineHeight: 1.6
                    }}
                  >
                    Putri dari Bapak Ade & Ibu Inah
                  </Typography>
                </Paper>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Section>

      <Section sx={{ bgcolor: 'rgba(255,192,203,0.1)' }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GradientText variant="h3" gutterBottom>
              Lokasi Acara
            </GradientText>
            
            <EventCard elevation={3} sx={{ mt: 4 }}>
              <Box sx={{ 
                position: 'relative', 
                width: '100%', 
                height: isMobile ? '300px' : '400px', 
                borderRadius: '16px',
                overflow: 'hidden',
                mb: 3 
              }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d506557.5502064972!2d107.7826889!3d-7.2997466!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f5feac758dbff%3A0x2ed2c0003e28987c!2sThe%20Priangan%20Boutique%20Hotel!5e0!3m2!1sid!2sid!4v1747191211687!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Box>
              
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontFamily: "'Montserrat', sans-serif",
                  color: '#FF1493',
                  fontSize: isMobile ? '1.5rem' : '2rem'
                }}
              >
                The Priangan Boutique Hotel
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  fontFamily: "'Montserrat', sans-serif",
                  mb: 3,
                  fontSize: isMobile ? '0.9rem' : '1rem'
                }}
              >
                Jl. Jend. Sudirman No.379, Sindangrasa,
                <br />
                Kec. Ciamis, Kabupaten Ciamis,
                <br />
                Jawa Barat 46219
              </Typography>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  startIcon={<LocationOnIcon />}
                  href="https://maps.app.goo.gl/Pqxv8aYgnnZbKAzv5"
                  target="_blank"
                  sx={{ 
                    background: 'linear-gradient(45deg, #FF1493 30%, #FF69B4 90%)',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: '25px',
                    fontFamily: "'Montserrat', sans-serif",
                    boxShadow: '0 3px 5px 2px rgba(255, 105, 180, .3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF69B4 30%, #FF1493 90%)',
                    }
                  }}
                  onClick={handleMapClick}
                >
                  Buka di Google Maps
                </Button>
              </motion.div>
            </EventCard>
          </motion.div>
        </Container>
      </Section>

      <Section sx={{ bgcolor: 'rgba(255,192,203,0.1)' }}>
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GradientText 
              variant="h3" 
              gutterBottom 
              sx={{ 
                mb: 6,
                fontSize: isMobile ? '2.5rem' : '3.5rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Menuju Hari Bahagia
            </GradientText>
            <Box 
              sx={{ 
                p: isMobile ? 2 : 4,
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(255,105,180,0.1)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                }
              }}
            >
              <Countdown
                date={weddingDate}
                renderer={(props) => (
                  <CountdownRenderer {...props} isMobile={isMobile} />
                )}
              />
            </Box>
          </motion.div>
        </Container>
      </Section>

      <Box
        component="footer"
        sx={{
          py: 6,
          background: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            zIndex: 0,
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography 
              variant="body1" 
              gutterBottom 
              sx={{ 
                fontFamily: "'Montserrat', sans-serif",
                fontSize: isMobile ? '0.9rem' : '1.1rem',
                lineHeight: 1.8,
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
                px: 2,
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir
              untuk memberikan doa restu kepada kami
            </Typography>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3
              }}
            >
              <GradientText 
                variant="h3" 
                sx={{ 
                  fontSize: isMobile ? '2rem' : '2.5rem',
                  mb: 3,
                  background: 'white',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  textShadow: 'none'
                }}
              >
                Naufal & Aini
              </GradientText>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <IconButton 
                sx={{ 
                  color: 'white',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(5px)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.3)',
                  },
                  width: 50,
                  height: 50,
                  mt: 2
                }}
              >
                <FavoriteIcon sx={{ 
                  fontSize: 30,
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
                }} />
              </IconButton>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      <IconButton
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          bgcolor: isPlaying ? 'rgba(255,20,147,0.9)' : 'rgba(255,20,147,0.6)',
          color: 'white',
          '&:hover': { 
            bgcolor: 'rgba(255,20,147,1)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease-in-out',
          animation: isPlaying ? 'pulse 2s infinite' : 'none',
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
              boxShadow: '0 0 0 0 rgba(255,20,147,0.7)',
            },
            '70%': {
              transform: 'scale(1.1)',
              boxShadow: '0 0 0 10px rgba(255,20,147,0)',
            },
            '100%': {
              transform: 'scale(1)',
              boxShadow: '0 0 0 0 rgba(255,20,147,0)',
            },
          },
          zIndex: 1000,
        }}
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        <MusicNoteIcon />
      </IconButton>
    </Box>
  );
};

export default Home; 