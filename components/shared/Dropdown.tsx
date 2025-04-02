"use client";

import React, { useState, useEffect } from 'react';
import { Dropdown as CarbonDropdown } from '@carbon/react';

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
  selectedItem?: DropdownOption | null;
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
  // Track controlled state internally to prevent switching between controlled/uncontrolled
  const [internalSelected, setInternalSelected] = useState<DropdownOption | undefined>(undefined);

  // Sync with external selectedItem prop
  useEffect(() => {
    if (selectedItem !== undefined) {
      setInternalSelected(selectedItem || undefined);
    }
  }, [selectedItem]);

  // Use internal state if available, otherwise use prop (ensures consistent value type)
  const normalizedSelectedItem = internalSelected;

 width ? { width: typeof width === 'number' ? `${width}px` : width } : {};

  const handleChange = ({ selectedItem: newSelectedItem }: { selectedItem: DropdownOption | null }) => {
    const item = newSelectedItem as DropdownOption;
    setInternalSelected(item);
    onChange(item);
  };

  return (
    <div className="dropdownWrapper">
      <CarbonDropdown
        id={id}
        titleText={titleText}
        helperText={helperText}
        label={label ?? placeholder}
        items={items}
        selectedItem={normalizedSelectedItem}
        onChange={handleChange}
        disabled={disabled}
        size={size}
        invalid={invalid}
        invalidText={invalidText}
        warn={warn}
        warnText={warnText}
        direction={direction}
        className="dropdown"
      />
    </div>
  );
};

export default Dropdown;
