import { describe, it, vi, expect } from 'vitest';
import { render, screen } from '../utils/test-utils';
import { Layout } from '../../src/components/layout';

// Mock the child components
vi.mock('../../src/components/sidebar', () => ({
  AppSidebar: () => <div data-testid="app-sidebar">Sidebar Content</div>,
}));

vi.mock('../../src/components/breadcrumb', () => ({
  Breadcrumb: () => <div data-testid="breadcrumb">Breadcrumb Content</div>,
}));

describe('Layout Component', () => {
  it('renders correctly with children', () => {
    render(
      <Layout>
        <div data-testid="test-child">Test Child Content</div>
      </Layout>
    );

    // Check that the sidebar is rendered
    expect(screen.getByTestId('app-sidebar')).toBeInTheDocument();
    
    // Check that the breadcrumb is rendered
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    
    // Check that the children are rendered
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Child Content')).toBeInTheDocument();
  });

  it('applies the correct layout structure', () => {
    render(
      <Layout>
        <div>Child Content</div>
      </Layout>
    );

    // Check for main layout container
    const layoutContainer = screen.getByText('Sidebar Content').closest('.layout');
    expect(layoutContainer).toBeInTheDocument();
    
    // Check for content container
    const contentContainer = screen.getByText('Breadcrumb Content').closest('.content');
    expect(contentContainer).toBeInTheDocument();
    
    // Check for page content container
    const pageContentContainer = screen.getByText('Child Content').closest('.page-content');
    expect(pageContentContainer).toBeInTheDocument();
  });
});