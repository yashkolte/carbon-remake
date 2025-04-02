'use client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';

import { Dropdown, TextInput, Button, Row, Column, FlexGrid, Form } from '@carbon/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AppDispatch, RootState } from '@/redux/store';
import { updateForm } from '@/redux/formSlice';


const FormComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const formState = useSelector((state: RootState) => state.form);
  const searchParams = useSearchParams();
  const isReadOnly = searchParams.get('isReadOnly') === 'true';
  const router = useRouter();

  // Update initialValues to include textInputAddress
  const formik = useFormik({
    initialValues: {
      dropdown1: formState.dropdown1 || '',
      dropdown2: formState.dropdown2 || '',
      textInput1: formState.textInput1 || '',
      textInput2: formState.textInput2 || '',
      textInputAddress: formState.textInputAddress || '', // New field added here
    },
    validationSchema: Yup.object({
      textInput1: Yup.string().required('Name is required'),
      textInput2: Yup.string().email('Invalid email address').required('Email is required'),
      textInputAddress: Yup.string().required('Address is required'),
    }),
    onSubmit: (values) => {
      console.log('Form Submitted:', values);
      dispatch(updateForm(values)); 
      router.push('/Dashboard');
    },
  });

  // Handle dropdown and text field changes, and update Redux state
  const handleDropdownChange = (field: string, value: string) => {
    formik.setFieldValue(field, value); // Update Formik's internal state
    dispatch(updateForm({ ...formik.values, [field]: value })); // Update Redux state
  };

  const handleTextInputChange = (field: string, value: string) => {
    formik.setFieldValue(field, value); // Update Formik's internal state
    dispatch(updateForm({ ...formik.values, [field]: value })); // Update Redux state
  };

  return (
    <Form onSubmit={formik.handleSubmit} data-testid="form">
      <FlexGrid>
        <Row>
          <Column lg={4}>
            <Dropdown
              id="dropdown1"
              label="Gender"
              titleText="Select an option"
              items={['Male', 'Female', 'Other']}
              selectedItem={formik.values.dropdown1}
              onChange={({ selectedItem }) => handleDropdownChange('dropdown1', selectedItem as string)}
              disabled={isReadOnly}
              data-testid="dropdown1"
            />
          </Column>
          <Column lg={4}>
            <Dropdown
              id="dropdown2"
              label="Department"
              titleText="Select an option"
              items={['CSE', 'ECE', 'ISE']}
              selectedItem={formik.values.dropdown2}
              onChange={({ selectedItem }) => handleDropdownChange('dropdown2', selectedItem as string)}
              disabled={isReadOnly}
              data-testid="dropdown2"
            />
          </Column>
        </Row>
        <Row>
          <Column lg={4}>
            <TextInput
              id="textInput1"
              labelText="Name"
              value={formik.values.textInput1}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={formik.touched.textInput1 && !!formik.errors.textInput1}
              invalidText={formik.errors.textInput1}
              disabled={isReadOnly}
              data-testid="textInput1"
            />
          </Column>
          <Column lg={4}>
            <TextInput
              id="textInput2"
              labelText="Email"
              type="email"
              value={formik.values.textInput2}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={formik.touched.textInput2 && !!formik.errors.textInput2}
              invalidText={formik.errors.textInput2}
              disabled={isReadOnly}
              data-testid="textInput2"
            />
          </Column>
        </Row>
        <Row>
          <Column lg={4}>
            <TextInput
              id="textInputAddress"
              labelText="Address"
              placeholder="Enter your address"
              type="text"
              value={formik.values.textInputAddress} // Bind the Address input value to Formik's state
              onChange={e => handleTextInputChange('textInputAddress', e.target.value)} // Handle change and dispatch to Redux
              onBlur={formik.handleBlur}
              invalid={formik.touched.textInputAddress && !!formik.errors.textInputAddress}
              invalidText={formik.errors.textInputAddress}
              disabled={isReadOnly}
              data-testid="textInputAddress"
            />
          </Column>
        </Row>
        {!isReadOnly && (
          <Row>
            <Column lg={4}>
              <Button type="submit" kind="primary" data-testid="submitButton">
                Submit
              </Button>
            </Column>
          </Row>
        )}
      </FlexGrid>
    </Form>
  );
};

export default FormComponent;
