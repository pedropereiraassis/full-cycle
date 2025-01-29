import { Box, Button, IconButton, Typography } from '@mui/material'
import { useAppSelector } from '../../app/hooks'
import { selectCategories } from './categorySlice'
import { Link } from 'react-router-dom'
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'

export const CategoryList = () => {
  const categories = useAppSelector(selectCategories)

  const componentProps = {
    toolbar: {
      showQuickFilter: true,
      quickFilterProps: { debounceMs: 500 },
    },
  }

  const rows: GridRowsProp = categories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    is_active: category.is_active,
    created_at: new Date(category.created_at).toLocaleDateString('pt-BR'),
  }))

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1, renderCell: renderNameCell },
    {
      field: 'is_active',
      headerName: 'Active',
      flex: 1,
      type: 'boolean',
      renderCell: renderIsActiveCell,
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: renderActionsCell,
    },
  ]

  function renderNameCell(rowData: GridRenderCellParams) {
    return (
      <Link
        style={{ textDecoration: 'none' }}
        to={`/categories/edit/${rowData.id}`}
      >
        <Typography color="primary">{rowData.value}</Typography>
      </Link>
    )
  }

  function renderActionsCell(params: GridRenderCellParams) {
    return (
      <IconButton
        color="secondary"
        onClick={() => console.log('clicked')}
        aria-label="delete"
      >
        <DeleteIcon />
      </IconButton>
    )
  }

  function renderIsActiveCell(rowData: GridRenderCellParams) {
    return (
      <Typography color={rowData.value ? 'primary' : 'secondary'}>
        {rowData.value ? 'Active' : 'Inactive'}
      </Typography>
    )
  }

  return (
    <Box maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/categories/create"
          style={{ marginBottom: '1rem' }}
        >
          New Category
        </Button>
      </Box>

      <Box sx={{ display: 'flex', height: 600 }}>
        <DataGrid
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          componentsProps={componentProps}
          disableColumnFilter={true}
          disableColumnSelector={true}
          disableDensitySelector={true}
          disableSelectionOnClick={true}
          rows={rows}
          rowsPerPageOptions={[2, 20, 50, 100]}
        />
      </Box>
    </Box>
  )
}
