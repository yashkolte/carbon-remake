import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormState {
  dropdown1: string;
  dropdown2: string;
  textInput1: string;
  textInput2: string;
  textInputAddress: string;
}

const initialState: FormState = {
  dropdown1: '',
  dropdown2: '',
  textInput1: '',
  textInput2: '',
  textInputAddress: '',
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateForm(state, action: PayloadAction<Partial<FormState>>) {
      return { ...state, ...action.payload };
    },
    resetForm() {
      return initialState;
    },
  },
});

export const { updateForm, resetForm } = formSlice.actions;
export default formSlice.reducer;