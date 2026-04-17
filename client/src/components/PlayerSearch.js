import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  Paper, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  InputAdornment, 
  Typography,
  Fade,
  CircularProgress
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import axios from '../requester';
import { useHistory } from 'react-router-dom';

const MIN_QUERY_LENGTH = 3;

/**
 * PlayerSearch Component
 * * A modern, "command palette" style search bar.
 * Designed to be placed in a header or at the top of a dashboard.
 */
export function PlayerSearch() {
  const history = useHistory();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Search Effect
  useEffect(() => {
    if (query.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    setIsOpen(true);

    const debounceTimer = setTimeout(async () => {
      try {
        const res = await axios.get(`/api/search/${query}`);
        setResults(res.data);
      } catch (err) {
        console.error("Search failed", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400); // 400ms delay

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handlePlayerClick = (player) => {
    setQuery('');
    setIsOpen(false);
    history.push(`/players/${player.name}`);
  };

  return (
    <Box 
      ref={searchRef}
      style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '500px', 
        margin: '0 auto' 
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search players..."
        size="small"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= MIN_QUERY_LENGTH && setIsOpen(true)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: loading && (
            <InputAdornment position="end">
              <CircularProgress size={16} />
            </InputAdornment>
          )
        }}
      />

      <Fade in={isOpen && (results?.length > 0 || (query.length >= MIN_QUERY_LENGTH))}>
        <Paper 
          elevation={4}
          style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            right: 0,
            zIndex: 1500,
            borderRadius: '12px',
            maxHeight: '400px',
            overflowY: 'auto',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
          }}
        >
          {results?.length > 0 ? (
            <List sx={{ p: 0 }}>
              {results?.map((player) => (
                <ListItem 
                  button
                  key={player.id} 
                  onClick={() => handlePlayerClick(player)}
                  style={{
                    borderBottom: '1px solid #f0f0f0',
                    '&:lastChild': { borderBottom: 'none' },
                    py: 1.5
                  }}
                >
                  <ListItemText 
                    primary={
                      <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                        {player.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="textSecondary">
                        {player.team_name} • {player.pos}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : !loading ? (
            <Box p={3} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                No results found for "{query}"
              </Typography>
            </Box>
          ) : null}
        </Paper>
      </Fade>
    </Box>
  );
};
