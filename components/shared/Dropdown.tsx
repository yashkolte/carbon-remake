"use client";

import React from 'react';
import { Dropdown as CarbonDropdown } from '@carbon/react';
import styles from './Dropdown.module.scss';

export interface DropdownOption {
  id: string;
  text: string;
  [key: string]: any; // Allow additional properties
}

export interface DropdownProps {
  id: string;
  titleText?: string;
  helperText?: string;
  label?: string;
  items: DropdownOption[];
  selectedItem?: DropdownOption;
  onChange?: (selectedItem: DropdownOption) => void;  // Make onChange optional
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  light?: boolean;
  invalid?: boolean;
  invalidText?: string;
  warn?: boolean;
  warnText?: string;
  direction?: 'top' | 'bottom';
  width?: string | number;
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  titleText,
  helperText,
  label,
  items,
  selectedItem,
  onChange = () => { }, // Add default empty function
  disabled = false,
  className = '',
  placeholder = 'Select an option',
  size = 'md',
  light = false,
  invalid = false,
  invalidText,
  warn = false,
  warnText,
  direction = 'bottom',
  width,
}) => {
  const customStyles = width ? { width: typeof width === 'number' ? `${width}px` : width } : {};

  return (
    <div
      className={`${styles.dropdownWrapper} ${className}`}
      style={customStyles}
    >
      <CarbonDropdown
        id={id}
        titleText={titleText}
        helperText={helperText}
        label={label || placeholder}
        items={items}
        selectedItem={selectedItem}
        onChange={({ selectedItem }) => onChange(selectedItem as DropdownOption)}
        disabled={disabled}
        size={size}
        light={light}
        invalid={invalid}
        invalidText={invalidText}
        warn={warn}
        warnText={warnText}
        direction={direction}
        className={styles.dropdown}
      />
    </div>
  );
};

export default Dropdown;
