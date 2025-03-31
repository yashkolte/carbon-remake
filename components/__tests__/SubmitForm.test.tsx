import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SubmitForm from '@/app/dashboard/submitform/page';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

// Mock Redux hooks
const mockDispatch = jest.fn();
const mockSelector = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: () => mockSelector(),
}));

// Mock form slice actions
jest.mock('@/redux/slices/formSlice', () => ({
    saveForm: jest.fn((data) => ({ type: 'form/saveForm', payload: data })),
}));

// Mock TextInput component
jest.mock('@/components/shared/TextInput', () => {
    return function MockTextInput(props: any) {
        return (
            <div data-testid={`text-input-${props.id}`}>
                <label htmlFor={props.id}>{props.labelText}</label>
                <input
                    id={props.id}
                    type="text"
                    value={props.value}
                    onChange={props.onChange}
                    disabled={props.disabled}
                    placeholder={props.placeholder || ''}
                    data-testid={`input-${props.id}`}
                />
            </div>
        );
    };
});

// Mock Dropdown component
jest.mock('@/components/shared/Dropdown', () => {
    return function MockDropdown(props: any) {
        return (
            <div data-testid={`dropdown-${props.id}`}>
                <label htmlFor={props.id}>{props.label}</label>
                <select
                    id={props.id}
                    value={props.selectedItem || ''}
                    onChange={(e) => props.onChange(e.target.value)}
                    disabled={props.disabled}
                    data-testid={`select-${props.id}`}
                >
                    <option value="">Select...</option>
                    {props.items.map((item: string) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
            </div>
        );
    };
});

// Mock Carbon components
jest.mock('@carbon/react', () => ({
    Button: ({ children, kind, onClick, className, disabled }: any) => (
        <button
            type="button"
            onClick={onClick}
            className={className}
            disabled={disabled}
            data-kind={kind}
        >
            {children}
        </button>
    ),
    Grid: ({ children, className }: any) => (
        <div data-testid="grid" className={className}>{children}</div>
    ),
    Column: ({ children, className, sm, md, lg }: any) => (
        <div
            data-testid="column"
            className={className}
            data-sm={sm}
            data-md={md}
            data-lg={lg}
        >
            {children}
        </div>
    ),
}));

describe('SubmitForm Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock default Redux state
        mockSelector.mockReturnValue({
            firstName: '',
            lastName: '',
            gender: '',
            relationship: '',
            fileName: '',
            isReadOnly: false
        });
    });

    it('renders the form correctly with all fields', () => {
        render(<SubmitForm />);

        // Check that all form fields are rendered
        expect(screen.getByTestId('text-input-firstName')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-lastName')).toBeInTheDocument();
        expect(screen.getByTestId('dropdown-gender')).toBeInTheDocument();
        expect(screen.getByTestId('dropdown-relationship')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-fileInput')).toBeInTheDocument();

        // Check that the submit button is rendered
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('updates form values when inputs change', async () => {
        const user = userEvent.setup();
        render(<SubmitForm />);

        // Input test values
        await user.type(screen.getByTestId('input-firstName'), 'John');
        await user.type(screen.getByTestId('input-lastName'), 'Doe');

        // Check if the inputs have the correct values
        expect(screen.getByTestId('input-firstName')).toHaveValue('John');
        expect(screen.getByTestId('input-lastName')).toHaveValue('Doe');
    });

    it('handles dropdown selections correctly', async () => {
        const user = userEvent.setup();
        render(<SubmitForm />);

        // Select gender
        const genderSelect = screen.getByTestId('select-gender');
        await user.selectOptions(genderSelect, 'Male');
        expect(genderSelect).toHaveValue('Male');

        // Select relationship status
        const relationshipSelect = screen.getByTestId('select-relationship');
        await user.selectOptions(relationshipSelect, 'Single');
        expect(relationshipSelect).toHaveValue('Single');
    });

    it('handles file selection through the browse button', async () => {
        const user = userEvent.setup();
        render(<SubmitForm />);

        // Create a mock file
        const file = new File(['dummy content'], 'test-file.txt', { type: 'text/plain' });

        // Get the hidden file input (via test ID if available)
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        expect(fileInput).toBeInTheDocument();

        // Simulate file selection
        // Note: userEvent cannot interact with hidden elements, so we use fireEvent instead
        fireEvent.change(fileInput, { target: { files: [file] } });

        // Check if the filename is displayed in the text input
        await waitFor(() => {
            expect(screen.getByTestId('input-fileInput')).toHaveValue('test-file.txt');
        });
    });

    it('dispatches saveForm action on submit with correct values', async () => {
        const user = userEvent.setup();
        render(<SubmitForm />);

        // Fill out the form
        await user.type(screen.getByTestId('input-firstName'), 'Jane');
        await user.type(screen.getByTestId('input-lastName'), 'Smith');

        const genderSelect = screen.getByTestId('select-gender');
        await user.selectOptions(genderSelect, 'Female');

        const relationshipSelect = screen.getByTestId('select-relationship');
        await user.selectOptions(relationshipSelect, 'Married');

        // Create a mock file and simulate selection
        const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(fileInput, { target: { files: [file] } });

        // Submit the form
        await user.click(screen.getByRole('button', { name: /submit/i }));

        // Verify dispatch was called with correct form data
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
            payload: {
                firstName: 'Jane',
                lastName: 'Smith',
                gender: 'Female',
                relationship: 'Married',
                fileName: 'resume.pdf'
            }
        }));

        // Verify router navigation was called
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('loads saved data when form is in read-only mode', () => {
        // Set up mock data for read-only mode
        mockSelector.mockReturnValue({
            firstName: 'Robert',
            lastName: 'Johnson',
            gender: 'Male',
            relationship: 'Single',
            fileName: 'document.pdf',
            isReadOnly: true
        });

        render(<SubmitForm />);

        // Verify the form is populated with the saved data
        expect(screen.getByTestId('input-firstName')).toHaveValue('Robert');
        expect(screen.getByTestId('input-lastName')).toHaveValue('Johnson');
        expect(screen.getByTestId('select-gender')).toHaveValue('Male');
        expect(screen.getByTestId('select-relationship')).toHaveValue('Single');
        expect(screen.getByTestId('input-fileInput')).toHaveValue('document.pdf');

        // Verify submit button is not rendered in read-only mode
        expect(screen.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument();
    });

    it('disables form inputs when in read-only mode', () => {
        // Set up mock data for read-only mode
        mockSelector.mockReturnValue({
            firstName: 'Robert',
            lastName: 'Johnson',
            gender: 'Male',
            relationship: 'Single',
            fileName: 'document.pdf',
            isReadOnly: true
        });

        render(<SubmitForm />);

        // Check that inputs are disabled
        const firstNameInput = screen.getByTestId('input-firstName');
        expect(firstNameInput).toBeDisabled();

        const lastNameInput = screen.getByTestId('input-lastName');
        expect(lastNameInput).toBeDisabled();

        // For the dropdowns, we would check if they have the disabled attribute
        // but this depends on how the mock works - in our case we've set it to pass
        // the disabled prop through
        const genderSelect = screen.getByTestId('select-gender');
        expect(genderSelect).toBeDisabled();

        const relationshipSelect = screen.getByTestId('select-relationship');
        expect(relationshipSelect).toBeDisabled();
    });
});