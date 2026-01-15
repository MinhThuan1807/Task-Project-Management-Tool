import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectState {
  isCreateModalOpen: boolean;
  selectedProjectId: string | null;
}

const initialState: ProjectState = {
  isCreateModalOpen: false,
  selectedProjectId: null,
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    openCreateModal: (state) => {
      state.isCreateModalOpen = true;
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
    },
    setSelectedProject: (state, action: PayloadAction<string | null>) => {
      state.selectedProjectId = action.payload;
    },
  },
});

export const { openCreateModal, closeCreateModal, setSelectedProject } = projectSlice.actions;
export default projectSlice.reducer;