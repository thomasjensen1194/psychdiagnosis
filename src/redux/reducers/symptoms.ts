import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoadingType } from './auth';
import { Symptom } from 'types/generated';

const initialState = {
  status: 'idle' as LoadingType,
  symptoms: [] as Symptom[],
  selectedIds: [] as number[]
};

const symptomReducer = createSlice({
  name: 'symptom',
  initialState,
  reducers: {
    setSymptoms: (state, action: PayloadAction<Symptom[]>) => {
      state.symptoms = action.payload;
    },
    setStatus: (state, action: PayloadAction<LoadingType>) => {
      state.status = action.payload;
    },
    addSymptom: (state, action: PayloadAction<number>) => {
      const index = state.selectedIds.findIndex((id) => id === action.payload);
      console.log(index);
      if (index !== -1) {
        state.selectedIds.splice(index, 1);
      } else {
        state.selectedIds.push(action.payload);
      }
    }
  }
});

export default symptomReducer;
