import React, { useState } from 'react';
import { Grid, Paper, Box, Typography } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination'; // Correct v4 import

export function PaginatedSection({ title, data, renderItem, itemsPerPage = 10 }) {
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
          backgroundColor: '#fff', 
          border: '1px solid #e0e0e0', 
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '550px' 
        }}
      >
        <Box pb={1} mb={2} style={{ borderBottom: '2px solid #f0f0f0' }}>
          <Typography variant="h5" style={{ fontWeight: 800, color: '#333' }}>
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