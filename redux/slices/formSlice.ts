import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormState {
  firstName: string;
  lastName: string;
  gender: string;
  relationship: string;
  fileName: string;
  isReadOnly: boolean;
}

const initialState: FormState = {
  firstName: "",
  lastName: "",
  gender: "",
  relationship: "",
  fileName: "",
  isReadOnly: false, // Controls whether the form is editable
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    saveForm: (state, action: PayloadAction<Omit<FormState, "isReadOnly">>) => {
      return { ...state, ...action.payload, isReadOnly: true };
    },
    resetForm: () => initialState,
    setReadOnly: (state, action: PayloadAction<boolean>) => {
      state.isReadOnly = action.payload;
    },
  },
});

export const { saveForm, resetForm, setReadOnly } = formSlice.actions;
export default formSlice.reducer;
