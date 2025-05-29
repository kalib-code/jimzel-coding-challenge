import { describe, it, vi, expect } from 'vitest';
import { render, screen, fireEvent } from '../utils/test-utils';
import { CreateModal } from '../../src/components/crud-modals/CreateModal';

describe('CreateModal Component', () => {
  const mockOnHide = vi.fn();
  const mockFormHook = {
    refineCore: {
      onFinish: vi.fn(),
      formLoading: false,
    },
    handleSubmit: vi.fn((callback) => {
      return () => callback({ name: 'Test Data' });
    }),
    reset: vi.fn(),
  };
  
  const mockRenderFormFields = () => (
    <div data-testid="form-fields">Form Fields Content</div>
  );

  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when visible', () => {
    render(
      <CreateModal
        title="Create New Item"
        visible={true}
        onHide={mockOnHide}
        formHook={mockFormHook as any}
        renderFormFields={mockRenderFormFields}
      />
    );

    // Check that title and form fields are rendered
    expect(screen.getByText('Create New Item')).toBeInTheDocument();
    expect(screen.getByTestId('form-fields')).toBeInTheDocument();
    expect(screen.getByText('Form Fields Content')).toBeInTheDocument();
    
    // Check that buttons are rendered
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('does not render when not visible', () => {
    render(
      <CreateModal
        title="Create New Item"
        visible={false}
        onHide={mockOnHide}
        formHook={mockFormHook as any}
        renderFormFields={mockRenderFormFields}
      />
    );

    // Modal should not be visible
    expect(screen.queryByText('Create New Item')).not.toBeInTheDocument();
  });

  it('calls onHide when Cancel button is clicked', () => {
    render(
      <CreateModal
        title="Create New Item"
        visible={true}
        onHide={mockOnHide}
        formHook={mockFormHook as any}
        renderFormFields={mockRenderFormFields}
      />
    );

    // Click the Cancel button
    fireEvent.click(screen.getByText('Cancel'));
    
    // Check that onHide and reset were called
    expect(mockOnHide).toHaveBeenCalledTimes(1);
    expect(mockFormHook.reset).toHaveBeenCalledTimes(1);
  });

  it('submits form when Create button is clicked', () => {
    render(
      <CreateModal
        title="Create New Item"
        visible={true}
        onHide={mockOnHide}
        formHook={mockFormHook as any}
        renderFormFields={mockRenderFormFields}
      />
    );

    // Click the Create button
    fireEvent.click(screen.getByText('Create'));
    
    // Check that handleSubmit was called
    expect(mockFormHook.handleSubmit).toHaveBeenCalledTimes(1);
    
    // Check that onFinish was called with the form data
    expect(mockFormHook.refineCore.onFinish).toHaveBeenCalledWith({ name: 'Test Data' });
  });

  it('shows loading state when form is submitting', () => {
    const loadingFormHook = {
      ...mockFormHook,
      refineCore: {
        ...mockFormHook.refineCore,
        formLoading: true,
      },
    };

    render(
      <CreateModal
        title="Create New Item"
        visible={true}
        onHide={mockOnHide}
        formHook={loadingFormHook as any}
        renderFormFields={mockRenderFormFields}
      />
    );

    // Create button should be in loading state
    const createButton = screen.getByText('Create');
    expect(createButton.closest('button')).toHaveAttribute('aria-busy', 'true');
  });
});