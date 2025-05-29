import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";

interface FilterOption {
  field: string;
  label: string;
  type: 'text' | 'dropdown' | 'date' | 'number';
  options?: { label: string; value: any }[];
}

interface FilterPanelProps {
  options: FilterOption[];
  onFilter: (filters: Record<string, any>) => void;
  defaultFilters?: Record<string, any>;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ options, onFilter, defaultFilters = {} }) => {
  const [filters, setFilters] = useState<Record<string, any>>(defaultFilters);
  const [expanded, setExpanded] = useState(!!Object.keys(defaultFilters).length);

  // Apply any default filters when the component first loads
  useEffect(() => {
    if (Object.keys(defaultFilters).length > 0) {
      onFilter(defaultFilters);
    }
  }, [defaultFilters, onFilter]);

  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearFilters = () => {
    // Reset local filter state
    setFilters({});
    // Call onFilter with empty object to clear filters
    onFilter({});
    // Log for debugging
    console.log("Filters cleared - sending empty object to reset");
  };

  const handleApplyFilters = () => {
    onFilter(filters);
  };

  const renderFilterInput = (option: FilterOption) => {
    const value = filters[option.field];

    switch (option.type) {
      case 'text':
        return (
          <InputText
            value={value || ''}
            onChange={e => handleFilterChange(option.field, e.target.value)}
            placeholder={`Search by ${option.label.toLowerCase()}`}
            className="w-full"
          />
        );
      case 'dropdown':
        return (
          <Dropdown
            value={value}
            options={option.options}
            onChange={e => handleFilterChange(option.field, e.value)}
            placeholder={`Select ${option.label.toLowerCase()}`}
            className="w-full"
            showClear
          />
        );
      case 'date':
        return (
          <Calendar
            value={value}
            onChange={e => handleFilterChange(option.field, e.value)}
            placeholder={`Select ${option.label.toLowerCase()}`}
            className="w-full"
            showButtonBar
          />
        );
      case 'number':
        return (
          <InputText
            value={value || ''}
            onChange={e => handleFilterChange(option.field, e.target.value)}
            placeholder={`Enter ${option.label.toLowerCase()}`}
            className="w-full"
            keyfilter="int"
          />
        );
      default:
        return null;
    }
  };

  // Check if any filters are applied
  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key] !== undefined && filters[key] !== null && filters[key] !== ''
  );

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="filter-panel mb-4">
      <Card className="filter-card">
        <div className="filter-header p-3">
          <div className="flex align-items-center justify-content-between">
            <div className="flex align-items-center" onClick={toggleExpand}>
              <i className="pi pi-filter mr-2" />
              <span className="font-bold">Filters</span>
              {hasActiveFilters && (
                <span className="filter-badge ml-2">{Object.keys(filters).filter(k => filters[k]).length}</span>
              )}
            </div>
            <Button
              icon={expanded ? "pi pi-chevron-up" : "pi pi-chevron-down"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleExpand();
              }}
              className="p-button-text p-button-rounded"
              style={{ width: '2rem', height: '2rem' }}
            />
          </div>
        </div>
        
        {expanded && (
          <div className="filter-content p-3">
            <div className="p-fluid grid formgrid">
              {options.map((option) => (
                <div key={option.field} className="field col-12 md:col-4 lg:col-3">
                  <label htmlFor={option.field} className="block mb-2">
                    {option.label}
                  </label>
                  {renderFilterInput(option)}
                </div>
              ))}
            </div>
            <div className="flex justify-content-end gap-2 mt-3">
              <Button 
                label="Clear" 
                icon="pi pi-trash" 
                className="p-button-outlined p-button-secondary"
                onClick={handleClearFilters}
                disabled={!hasActiveFilters}
              />
              <Button 
                label="Apply Filters" 
                icon="pi pi-filter" 
                onClick={handleApplyFilters}
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};