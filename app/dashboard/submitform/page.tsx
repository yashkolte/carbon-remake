"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button, Grid, Column, Dropdown } from "@carbon/react";
import TextInputField from "@/components/shared/TextInput";
import { useDispatch, useSelector } from "react-redux";
import { saveForm } from "@/redux/slices/formSlice";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";

// Define form state type
type UserFormState = {
  firstName: string;
  lastName: string;
  gender: string;
  relationship: string;
  fileName: string;
};

const SubmitForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const formData = useSelector((state: RootState) => state.form);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Define initial state for form values
  const [formValues, setFormValues] = useState<UserFormState>({
    firstName: "",
    lastName: "",
    gender: "",
    relationship: "",
    fileName: "",
  });

  // Load saved data when revisiting
  useEffect(() => {
    if (formData.isReadOnly) {
      setFormValues({
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        gender: formData.gender || "",
        relationship: formData.relationship || "",
        fileName: formData.fileName || "",
      });
    }
  }, [formData]);

  // Handle input changes
  const handleChange = (id: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Check if file exists
    if (file) {
      setFormValues((prev) => ({ ...prev, fileName: file.name }));
    }
  };

  // Browse button click to trigger file input
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Handle form submission
  const handleSubmit = () => {
    dispatch(saveForm(formValues));
    router.push("/dashboard");
  };

  return (
    <Grid fullWidth className="formContainer">
      {/* First Name */}
      <Column sm={4} md={4} lg={8} className="column">
        <TextInputField
          labelText="Enter First Name"
          id="firstName"
          value={formValues.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          disabled={formData.isReadOnly}
          type="text"
        />
      </Column>

      {/* Last Name */}
      <Column sm={4} md={4} lg={8} className="column">
        <TextInputField
          labelText="Enter Last Name"
          id="lastName"
          value={formValues.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          disabled={formData.isReadOnly}
          type="text"
        />
      </Column>

      {/* Gender Dropdown */}
      <Column sm={4} md={4} lg={8} className="column">
        <Dropdown
          id="gender"
          label="Select Gender"
          items={["Male", "Female", "Other"]}
          selectedItem={formValues.gender || undefined}
          onChange={({ selectedItem }) => {
            if (selectedItem) {
              handleChange("gender", selectedItem);
            }
          }}
          disabled={formData.isReadOnly}
          titleText={undefined}
        />
      </Column>

      {/* Relationship Dropdown */}
      <Column sm={4} md={4} lg={8} className="column">
        <Dropdown
          id="relationship"
          label="Select Relationship Status"
          items={["Single", "Married"]}
          selectedItem={formValues.relationship || undefined}
          onChange={({ selectedItem }) => {
            if (selectedItem) {
              handleChange("relationship", selectedItem);
            }
          }}
          disabled={formData.isReadOnly}
          titleText={undefined}
        />
      </Column>

      {/* File Input Field with Browse Button */}
      <Column sm={4} md={4} lg={8} className="column">
        <div className="fileInputContainer">
          <TextInputField
            id="fileInput"
            name="fileInput"
            labelText="Select a file"
            placeholder="No file chosen"
            value={formValues.fileName} // ✅ Fixed
            // readOnly
            type="text"
            onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
              throw new Error("Function not implemented.");
            }}
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hiddenFileInput"
            onChange={handleFileChange}
          />
          <Button
            kind="secondary"
            // size="sm"
            onClick={handleBrowseClick}
            className="browseButton"
          >
            Browse
          </Button>
        </div>
      </Column>

      {/* Submit Button */}
      {!formData.isReadOnly && (
        <Column sm={4} md={4} lg={8} className="column">
          <Button
            kind="primary"
            className="submitBtn"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Column>
      )}
    </Grid>
  );
};

export default SubmitForm;
