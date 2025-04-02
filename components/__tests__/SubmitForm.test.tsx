import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SubmitForm from '@/app/dashboard/submitform/page';
import { configureStore } from '@reduxjs/toolkit';
import { saveForm } from '@/redux/slices/formSlice';

// Mock the redux hooks
jest.mock('@/redux/hooks', () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn(),
}));

// Mock Next.js navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

// Mock Carbon components
jest.mock('@carbon/react', () => ({
    Button: ({ children, kind, className, onClick, disabled }: any) => (
        <button
            type="button"
            className={className}
            onClick={onClick}
            disabled={disabled}
            data-kind={kind}
        >
            {children}
        </button>
    ),
    Grid: ({ children, fullWidth }: any) => (
        <div data-testid="grid" data-full-width={fullWidth}>
            {children}
        </div>
    ),
    Column: ({ children, lg, md, sm, className }: any) => (
        <div
            data-testid="column"
            data-lg={lg}
            data-md={md}
            data-sm={sm}
            className={className}
        >
            {children}
        </div>
    ),
    Dropdown: ({
        id,
        label,
        items,
        selectedItem,
        onChange,
        disabled,
        titleText
    }: any) => (
        <div data-testid={`dropdown-${id}`}>
            {titleText && <label htmlFor={id}>{titleText}</label>}
            <select
                id={id}
                value={selectedItem || ''}
                onChange={(e) => onChange({ selectedItem: e.target.value })}
                disabled={disabled}
                aria-label={label}
            >
                <option value="">Select an option</option>
                {items.map((item: string) => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </select>
        </div>
    ),
}));

// Mock TextInput component
jest.mock('@/components/shared/TextInput', () => {
    return function MockTextInput({
        id,
        labelText,
        value,
        onChange,
        disabled,
        type,
        placeholder
    }: any) {
        return (
            <div data-testid={`text-input-${id}`}>
                <label htmlFor={id}>{labelText}</label>
                <input
                    id={id}
                    type={type || 'text'}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    disabled={disabled}
                />
            </div>
        );
    };
});

describe('SubmitForm Component', () => {
    // Setup mock store
    const mockStore = configureStore({
        reducer: {}, // Provide a mock reducer or an empty object
    });
    let store: any;
    let mockDispatch: jest.Mock;

    beforeEach(() => {
        mockDispatch = jest.fn();
        // Mock Redux state and dispatch
        const useDispatchMock = jest.requireMock('@/redux/hooks').useAppDispatch;
        const useSelectorMock = jest.requireMock('@/redux/hooks').useAppSelector;

        useDispatchMock.mockReturnValue(mockDispatch);
        interface MockState {
            firstName: string;
            lastName: string;
            gender: string;
            relationship: string;
            fileName: string;
            isReadOnly: boolean;
        }

        useSelectorMock.mockImplementation((selector: (state: MockState) => any): MockState => {
            return {
            firstName: '',
            lastName: '',
            gender: '',
            relationship: '',
            fileName: '',
            isReadOnly: false
            };
        });

        // Reset mocks
        mockPush.mockClear();
    });

    it('renders the form correctly', () => {
        render(<SubmitForm />);

        // Check that form fields render correctly
        expect(screen.getByTestId('text-input-firstName')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-lastName')).toBeInTheDocument();
        expect(screen.getByTestId('dropdown-gender')).toBeInTheDocument();
        expect(screen.getByTestId('dropdown-relationship')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-fileInput')).toBeInTheDocument();

        // Check that submit button is present
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Browse' })).toBeInTheDocument();
    });

    it('updates form values when user inputs data', async () => {
        const user = userEvent.setup();
        render(<SubmitForm />);

        // Input first name
        const firstNameInput = screen.getByLabelText('Enter First Name');
        await user.type(firstNameInput, 'John');
        expect(firstNameInput).toHaveValue('John');

        // Input last name
        const lastNameInput = screen.getByLabelText('Enter Last Name');
        await user.type(lastNameInput, 'Doe');
        expect(lastNameInput).toHaveValue('Doe');

        // Select gender
        const genderDropdown = screen.getByLabelText('Select Gender');
        await user.selectOptions(genderDropdown, 'Male');
        expect(genderDropdown).toHaveValue('Male');

        // Select relationship status
        const relationshipDropdown = screen.getByLabelText('Select Relationship Status');
        await user.selectOptions(relationshipDropdown, 'Single');
        expect(relationshipDropdown).toHaveValue('Single');
    });

    it('handles file selection', async () => {
        const user = userEvent.setup();
        render(<SubmitForm />);

        // Create a mock file
        const file = new File(['test content'], 'test-file.txt', { type: 'text/plain' });

        // Get the hidden file input and simulate a file selection
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        expect(fileInput).not.toBeNull();

        // Simulate file selection
        await user.upload(fileInput, file);

        // The file name should be reflected in the text input
        const fileNameInput = screen.getByLabelText('Select a file');
        await waitFor(() => {
            expect(fileNameInput).toHaveValue('test-file.txt');
        });
    });

    it('handles form submission', async () => {
        const user = userEvent.setup();
        render(<SubmitForm />);

        // Fill out the form
        await user.type(screen.getByLabelText('Enter First Name'), 'John');
        await user.type(screen.getByLabelText('Enter Last Name'), 'Doe');
        await user.selectOptions(screen.getByLabelText('Select Gender'), 'Male');
        await user.selectOptions(screen.getByLabelText('Select Relationship Status'), 'Single');

        // Submit the form
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        // Check that form data was dispatched to Redux
        expect(mockDispatch).toHaveBeenCalledWith(
            saveForm(expect.objectContaining({
                firstName: 'John',
                lastName: 'Doe',
                gender: 'Male',
                relationship: 'Single',
            }))
        );

        // Check that navigation happened
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('loads saved data when form is in readonly mode', () => {
        // Setup mock for readonly mode
        const useSelectorMockReadOnly = jest.requireMock('@/redux/hooks').useAppSelector;
        useSelectorMockReadOnly.mockImplementation(() => {
            return {
                firstName: 'Saved',
                lastName: 'User',
                gender: 'Female',
                relationship: 'Married',
                fileName: 'document.pdf',
                isReadOnly: true
            };
        });

        render(<SubmitForm />);

        // Check that form fields contain the saved values
        expect(screen.getByLabelText('Enter First Name')).toHaveValue('Saved');
        expect(screen.getByLabelText('Enter Last Name')).toHaveValue('User');
        expect(screen.getByLabelText('Select Gender')).toHaveValue('Female');
        expect(screen.getByLabelText('Select Relationship Status')).toHaveValue('Married');
        expect(screen.getByLabelText('Select a file')).toHaveValue('document.pdf');

        // Submit button should not be present in readonly mode
        expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument();
    });

    it('triggers the file browser when browse button is clicked', async () => {
        const user = userEvent.setup();
        render(<SubmitForm />);

        // Mock the file input click
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        jest.spyOn(fileInput, 'click');

        // Click the browse button
        await user.click(screen.getByRole('button', { name: 'Browse' }));

        // Check that file input's click method was called
        expect(fileInput.click).toHaveBeenCalled();
    });
});