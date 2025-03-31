import React from 'react'
import { TextInput as CarbonTextInput } from '@carbon/react';

interface TextInputProps {
    id: string;
    name?: string;
    type: string;
    labelText: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    invalid?: boolean;
    invalidText?: string;
    required?: boolean;
    disabled?: any;
}

const CustomTextInput = (props: TextInputProps) => {
    const {
        id,
        name,
        type,
        labelText,
        placeholder,
        value,
        onChange,
        onBlur,
        invalid,
        invalidText,
        required,
        disabled
    } = props;

    return (
        <CarbonTextInput
            id={id}
            name={name}
            type={type}
            labelText={labelText}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            invalid={invalid}
            invalidText={invalidText}
            required={required}
            disabled={disabled}
        />
    );
}

export default CustomTextInput;