import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

export interface Category {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

const category: Category = {
  id: '5909b20c-2bef-46ca-ba6b-8497980525d4',
  name: 'Terror',
  description: 'Filmes de terror',
  is_active: true,
  created_at: '2021-05-19T01:13:07.000000Z',
  updated_at: '2021-05-19T01:13:07.000000Z',
  deleted_at: null,
}

export const initialState = [
  category,
  { ...category, id: '0909b20c-2bef-46ca-ba6b-8497980525d4', name: 'Ação' },
  { ...category, id: '3909b20c-2bef-46ca-ba6b-8497980525d4', name: 'Drama' },
  {
    ...category,
    id: '8909b20c-2bef-46ca-ba6b-8497980525d4',
    name: 'Suspense',
  },
]

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    createCategory(state, action) {
      state.push(action.payload)
    },
    updateCategory(state, action) {
      const index = state.findIndex(
        (category) => category.id === action.payload.id
      )
      state[index] = action.payload
    },
    deleteCategory(state, action) {
      const index = state.findIndex(
        (category) => category.id === action.payload.id
      )
      state.splice(index, 1)
    },
  },
})

export const selectCategories = (state: RootState) => state.categories
export const selectCategoryById = (state: RootState, id: string) => {
  const category = state.categories.find((category) => category.id === id)

  return (
    category || {
      id: '',
      name: '',
      description: '',
      is_active: false,
      created_at: '',
      updated_at: '',
      deleted_at: null,
    }
  )
}

export default categoriesSlice.reducer
export const { createCategory, updateCategory, deleteCategory } =
  categoriesSlice.actions
