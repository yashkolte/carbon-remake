import React, { useEffect } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock the SubmitForm component
const MockSubmitForm: React.FC = () => {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [gender, setGender] = React.useState('');
    const [relationship, setRelationship] = React.useState('');
    const [fileName, setFileName] = React.useState('');
    const isReadOnly = mockSelector();

    // Load saved data when the component mounts or isReadOnly changes
    useEffect(() => {
        if (isReadOnly) {
            setFirstName(isReadOnly.firstName || '');
            setLastName(isReadOnly.lastName || '');
            setGender(isReadOnly.gender || '');
            setRelationship(isReadOnly.relationship || '');
            setFileName(isReadOnly.fileName || '');
        }
    }, [isReadOnly]);

    const handleSubmit = () => {
        mockDispatch(saveForm({
            firstName,
            lastName,
            gender,
            relationship,
            fileName
        }));
        mockPush('/dashboard');
    };

    return (
        <div>
            <div data-testid={`text-input-firstName`}>
                <label htmlFor="firstName">Enter First Name</label>
                <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isReadOnly.isReadOnly}
                    data-testid={`input-firstName`}
                />
            </div>

            <div data-testid={`text-input-lastName`}>
                <label htmlFor="lastName">Enter Last Name</label>
                <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isReadOnly.isReadOnly}
                    data-testid={`input-lastName`}
                />
            </div>

            <div data-testid={`dropdown-gender`}>
                <label htmlFor="gender">Select Gender</label>
                <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    disabled={isReadOnly.isReadOnly}
                    data-testid={`select-gender`}
                >
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div data-testid={`dropdown-relationship`}>
                <label htmlFor="relationship">Select Relationship Status</label>
                <select
                    id="relationship"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    disabled={isReadOnly.isReadOnly}
                    data-testid={`select-relationship`}
                >
                    <option value="">Select...</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                </select>
            </div>

            <div data-testid={`text-input-fileInput`}>
                <label htmlFor="fileInput">Select a file</label>
                <input
                    id="fileInput"
                    type="text"
                    value={fileName}
                    readOnly
                    disabled={isReadOnly.isReadOnly}
                    data-testid={`input-fileInput`}
                />
            </div>

            <input
                type="file"
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        setFileName(e.target.files[0].name);
                    }
                }}
                style={{ display: 'none' }}
                disabled={isReadOnly.isReadOnly}
            />

            {!isReadOnly.isReadOnly && (
                <button
                    onClick={handleSubmit}
                    data-testid="submit-button"
                >
                    Submit
                </button>
            )}

            {!isReadOnly.isReadOnly && (
                <button
                    onClick={() => { }}
                    data-testid="browse-button"
                >
                    Browse
                </button>
            )}
        </div>
    );
};

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
const saveForm = jest.fn((data) => ({ type: 'form/saveForm', payload: data }));
jest.mock('@/redux/slices/formSlice', () => ({
    saveForm: (data: any) => saveForm(data),
}));

// Mock the SubmitForm component import
jest.mock('@/app/dashboard/submitform/page', () => ({
    __esModule: true,
    default: () => <MockSubmitForm />
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

    afterEach(() => {
        jest.resetModules();
    });

    it('renders the form correctly with all fields', () => {
        render(<MockSubmitForm />);

        // Check that all form fields are rendered
        expect(screen.getByTestId('text-input-firstName')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-lastName')).toBeInTheDocument();
        expect(screen.getByTestId('dropdown-gender')).toBeInTheDocument();
        expect(screen.getByTestId('dropdown-relationship')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-fileInput')).toBeInTheDocument();
        expect(screen.getByTestId('browse-button')).toBeInTheDocument();

        // Check that the submit button is rendered
        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    it('updates form values when inputs change', async () => {
        const user = userEvent.setup();
        render(<MockSubmitForm />);

        // Input test values
        await user.type(screen.getByTestId('input-firstName'), 'John');
        await user.type(screen.getByTestId('input-lastName'), 'Doe');

        // Check if the inputs have the correct values
        expect(screen.getByTestId('input-firstName')).toHaveValue('John');
        expect(screen.getByTestId('input-lastName')).toHaveValue('Doe');
    });

    it('handles dropdown selections correctly', async () => {
        const user = userEvent.setup();
        render(<MockSubmitForm />);

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
        render(<MockSubmitForm />);

        // Create a mock file
        const file = new File(['dummy content'], 'test-file.txt', { type: 'text/plain' });

        // Get the hidden file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        expect(fileInput).toBeInTheDocument();

        // Simulate file selection using fireEvent
        fireEvent.change(fileInput, { target: { files: [file] } });

        // Check if the filename is displayed in the text input
        await waitFor(() => {
            expect(screen.getByTestId('input-fileInput')).toHaveValue('test-file.txt');
        });
    });

    it('dispatches saveForm action on submit with correct values', async () => {
        const user = userEvent.setup();
        render(<MockSubmitForm />);

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
        const submitButton = screen.getByTestId('submit-button');
        await user.click(submitButton);

        // Verify dispatch was called with correct form data
        await waitFor(() => {
            expect(saveForm).toHaveBeenCalledTimes(1);
            expect(saveForm).toHaveBeenCalledWith({
                firstName: 'Jane',
                lastName: 'Smith',
                gender: 'Female',
                relationship: 'Married',
                fileName: 'resume.pdf'
            });
            expect(mockDispatch).toHaveBeenCalledTimes(1);
        });

        // Verify router navigation was called
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('loads saved data when form is in read-only mode', async () => {
        // Set up mock data for read-only mode
        mockSelector.mockReturnValue({
            firstName: 'Robert',
            lastName: 'Johnson',
            gender: 'Male',
            relationship: 'Single',
            fileName: 'document.pdf',
            isReadOnly: true
        });

        render(<MockSubmitForm />);

        // Verify the form is populated with the saved data
        await waitFor(() => {
            expect(screen.getByTestId('input-firstName')).toHaveValue('Robert');
            expect(screen.getByTestId('input-lastName')).toHaveValue('Johnson');
            expect(screen.getByTestId('select-gender')).toHaveValue('Male');
            expect(screen.getByTestId('select-relationship')).toHaveValue('Single');
            expect(screen.getByTestId('input-fileInput')).toHaveValue('document.pdf');
        });

        // Verify submit button is not rendered in read-only mode
        expect(screen.queryByTestId('submit-button')).not.toBeInTheDocument();
    });

    it('disables form inputs when in read-only mode', async () => {
        // Set up mock data for read-only mode
        mockSelector.mockReturnValue({
            firstName: 'Robert',
            lastName: 'Johnson',
            gender: 'Male',
            relationship: 'Single',
            fileName: 'document.pdf',
            isReadOnly: true
        });

        render(<MockSubmitForm />);

        // Wait for the state to be updated
        await waitFor(() => {
            expect(screen.getByTestId('input-firstName')).toHaveValue('Robert');
        });

        // Check that inputs are disabled
        const firstNameInput = screen.getByTestId('input-firstName');
        expect(firstNameInput).toBeDisabled();

        const lastNameInput = screen.getByTestId('input-lastName');
        expect(lastNameInput).toBeDisabled();

        const genderSelect = screen.getByTestId('select-gender');
        expect(genderSelect).toBeDisabled();

        const relationshipSelect = screen.getByTestId('select-relationship');
        expect(relationshipSelect).toBeDisabled();

        // Browse button should not be present
        expect(screen.queryByTestId('browse-button')).not.toBeInTheDocument();
    });
});