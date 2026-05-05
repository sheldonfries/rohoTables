import React, { useState } from 'react';
import { Grid, Paper, Box, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

export function PaginatedSection({ title, data, renderItem, itemsPerPage = 10 }) {
  const theme = useTheme();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Grid item xs={12} md={4}>
      <Paper 
        elevation={0} 
        style={{ 
          padding: 16, 
          backgroundColor: theme.palette.background.paper, 
          border: '1px solid ' + theme.palette.divider, 
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '550px' 
        }}
      >
        <Box pb={1} mb={2} style={{ borderBottom: '2px solid ' + theme.palette.divider }}>
          <Typography variant="h5" style={{ fontWeight: 800, color: theme.palette.text.primary }}>
            {title}
          </Typography>
        </Box>

        <Box style={{ flexGrow: 1 }}>
          {paginatedData.map((item, index) => renderItem(item, index))}
        </Box>

        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              size="small"
              color="primary"
            />
          </Box>
        )}
      </Paper>
    </Grid>
  );
}