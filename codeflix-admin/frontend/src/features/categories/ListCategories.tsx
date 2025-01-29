import { Box, Button, IconButton, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { deleteCategory, selectCategories } from './categorySlice'
import { Link } from 'react-router-dom'
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import { useSnackbar } from 'notistack'

export const CategoryList = () => {
  const categories = useAppSelector(selectCategories)
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()

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
      field: 'id',
      headerName: 'Actions',
      type: 'string',
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

  function handleDeleteCategory(id: string) {
    dispatch(deleteCategory(id))
    enqueueSnackbar('Success deleting category', { variant: 'success' })
  }

  function renderActionsCell(params: GridRenderCellParams) {
    return (
      <IconButton
        color="secondary"
        onClick={() => handleDeleteCategory(params.value)}
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
