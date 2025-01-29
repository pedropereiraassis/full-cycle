import { Box, Paper, Typography } from '@mui/material'
import { useState } from 'react'
import { Category, createCategory } from './categorySlice'
import { CategoryForm } from './components/CategoryForm'
import { useAppDispatch } from '../../app/hooks'
import { useSnackbar } from 'notistack'

export const CategoryCreate = () => {
  const [isDisabled, setIsDisabled] = useState(false)
  const [categoryState, setCategoryState] = useState<Category>({
    id: '',
    name: '',
    description: '',
    is_active: false,
    created_at: '',
    updated_at: '',
    deleted_at: null,
  })
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    dispatch(createCategory(categoryState))
    enqueueSnackbar('Success creating category', { variant: 'success' })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setCategoryState({ ...categoryState, [name]: value })
  }

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target
    setCategoryState({ ...categoryState, [name]: checked })
  }
  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Create Category</Typography>
          </Box>
        </Box>
        <CategoryForm
          category={categoryState}
          isDisabled={isDisabled}
          isLoading={false}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleToggle={handleToggle}
        ></CategoryForm>
      </Paper>
    </Box>
  )
}
