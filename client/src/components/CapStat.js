import React from 'react';
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography';

export default function CapStat({ label, value, color = 'white', isCurrency = true }) {
  // Determine if we use the "success" green or "error" red based on value
  const getStatusColor = () => {
    if (color === 'success') return '#4caf50';
    if (color === 'error') return '#f44336';
    return 'rgba(255, 255, 255, 0.2)'; // Default light border
  };

  return (
    <Box
      sx={{
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        p: 1.5,
        minWidth: '140px',
        textAlign: 'center',
      }}
    >
      <Typography 
        variant="caption" 
        sx={{ 
          display: 'block', 
          color: 'rgba(255, 255, 255, 0.7)', 
          fontWeight: 'bold', 
          textTransform: 'uppercase',
          mb: 0.5 
        }}
      >
        {label}
      </Typography>
      
      <Box
        sx={{
          backgroundColor: color === 'white' ? 'rgba(255, 255, 255, 0.15)' : getStatusColor(),
          borderRadius: '4px', // This makes it a soft rectangle
          py: 0.5,
          px: 1,
        }}
      >
        <Typography 
          variant="body1" 
          sx={{ fontWeight: 'bold', color: 'white' }}
        >
          {isCurrency ? `$${value.toLocaleString()}M` : value}
        </Typography>
      </Box>
    </Box>
  );
};