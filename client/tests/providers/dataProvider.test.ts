import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { dataProvider, generateFilter, generateSort } from '../../src/providers/dataProvider';
import { CrudFilters, CrudSorting } from '@refinedev/core';
import axios from 'axios';
import { server } from '../mocks/server';
import { mockEmployees, mockDepartments } from '../mocks/handlers';

// Create a mock axios instance
const mockAxios = axios.create();

describe('DataProvider', () => {
  // Setup MSW Server before all tests
  beforeAll(() => server.listen());
  
  // Reset handlers after each test
  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });
  
  // Close server after all tests
  afterAll(() => server.close());

  // Test helper functions
  describe('Helper Functions', () => {
    it('generateFilter should convert CrudFilters to query parameters', () => {
      const filters: CrudFilters = [
        { field: 'name', operator: 'eq', value: 'John' },
        { field: 'email', operator: 'contains', value: 'example.com' },
        { field: 'active', operator: 'eq', value: true },
        { field: 'deleted', operator: 'eq', value: null }, // Should be ignored
      ];

      const result = generateFilter(filters);
      
      expect(result).toEqual({
        name: 'John',
        search: 'example.com',
        active: true,
      });
    });

    it('generateSort should convert CrudSorting to sort parameters', () => {
      const sorters: CrudSorting = [
        { field: 'name', order: 'asc' },
      ];

      const result = generateSort(sorters);
      
      expect(result).toEqual({
        sort: 'name',
        order: 'asc',
      });
    });

    it('generateSort should return empty object for empty sorters', () => {
      const result = generateSort([]);
      expect(result).toEqual({});
    });
  });

  // Test actual data provider methods
  describe('DataProvider Methods', () => {
    const apiUrl = '/api';
    const provider = dataProvider(apiUrl, mockAxios);

    it('getList should fetch a list of resources', async () => {
      // Mock the axios get method
      vi.spyOn(mockAxios, 'get').mockResolvedValueOnce({
        data: mockEmployees
      });

      const result = await provider.getList({
        resource: 'employees',
      });

      expect(mockAxios.get).toHaveBeenCalledWith('/api/employees');
      expect(result.data).toEqual(mockEmployees);
      expect(result.total).toBe(mockEmployees.length);
    });

    it('getList should handle filters and sorters', async () => {
      // Mock the axios get method
      vi.spyOn(mockAxios, 'get').mockResolvedValueOnce({
        data: [mockEmployees[0]]
      });

      const result = await provider.getList({
        resource: 'employees',
        filters: [
          { field: 'department_id', operator: 'eq', value: 1 },
          { field: 'name', operator: 'contains', value: 'John' },
        ],
        sorters: [
          { field: 'last_name', order: 'asc' },
        ],
      });

      expect(mockAxios.get).toHaveBeenCalledWith('/api/employees?department_id=1&search=John&sort=last_name&order=asc');
      expect(result.data).toEqual([mockEmployees[0]]);
      expect(result.total).toBe(1);
    });

    it('getOne should fetch a single resource', async () => {
      // Mock the axios get method
      vi.spyOn(mockAxios, 'get').mockResolvedValueOnce({
        data: mockEmployees[0]
      });

      const result = await provider.getOne({
        resource: 'employees',
        id: '1',
      });

      expect(mockAxios.get).toHaveBeenCalledWith('/api/employees/1');
      expect(result.data).toEqual(mockEmployees[0]);
    });

    it('create should create a new resource', async () => {
      const newEmployee = {
        first_name: 'Alice',
        last_name: 'Johnson',
        department_id: 1,
      };

      // Mock the axios post method
      vi.spyOn(mockAxios, 'post').mockResolvedValueOnce({
        data: { id: 3, ...newEmployee }
      });

      const result = await provider.create({
        resource: 'employees',
        variables: newEmployee,
      });

      expect(mockAxios.post).toHaveBeenCalledWith('/api/employees', newEmployee);
      expect(result.data).toEqual({ id: 3, ...newEmployee });
    });

    it('update should update an existing resource', async () => {
      const updatedEmployee = {
        first_name: 'John',
        last_name: 'Updated',
      };

      // Mock the axios put method
      vi.spyOn(mockAxios, 'put').mockResolvedValueOnce({
        data: { id: 1, ...updatedEmployee }
      });

      const result = await provider.update({
        resource: 'employees',
        id: '1',
        variables: updatedEmployee,
      });

      expect(mockAxios.put).toHaveBeenCalledWith('/api/employees/1', updatedEmployee);
      expect(result.data).toEqual({ id: 1, ...updatedEmployee });
    });

    it('deleteOne should delete a resource', async () => {
      // Mock the axios delete method
      vi.spyOn(mockAxios, 'delete').mockResolvedValueOnce({
        data: { message: 'Employee deleted successfully' }
      });

      const result = await provider.deleteOne({
        resource: 'employees',
        id: '1',
      });

      expect(mockAxios.delete).toHaveBeenCalledWith('/api/employees/1');
      expect(result.data).toEqual({ message: 'Employee deleted successfully' });
    });

    it('getMany should fetch multiple resources', async () => {
      // Mock the axios get method for each ID
      vi.spyOn(mockAxios, 'get')
        .mockResolvedValueOnce({ data: mockEmployees[0] })
        .mockResolvedValueOnce({ data: mockEmployees[1] });

      const result = await provider.getMany({
        resource: 'employees',
        ids: ['1', '2'],
      });

      expect(mockAxios.get).toHaveBeenCalledWith('/api/employees/1');
      expect(mockAxios.get).toHaveBeenCalledWith('/api/employees/2');
      expect(result.data).toEqual([mockEmployees[0], mockEmployees[1]]);
    });

    it('custom should make custom API calls', async () => {
      // Mock the axios get method
      vi.spyOn(mockAxios, 'get').mockResolvedValueOnce({
        data: { stats: { count: 5 } }
      });

      const result = await provider.custom({
        url: '/statistics/employees',
        method: 'get',
        query: { active: true },
      });

      expect(mockAxios.get).toHaveBeenCalledWith('/api/statistics/employees?active=true', {});
      expect(result.data).toEqual({ stats: { count: 5 } });
    });

    it('getApiUrl should return the API URL', () => {
      const url = provider.getApiUrl();
      expect(url).toBe(apiUrl);
    });
  });
});