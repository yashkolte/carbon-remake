"use client";

import React, { useEffect } from 'react';
import {
  DataTable,
  Table as CarbonTable,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Pagination,
  Button,
  TableToolbarAction,
  TableToolbarMenu,
  TableSelectAll,
  TableSelectRow
} from '@carbon/react';
import styles from './Table.module.scss';

export interface TableColumn {
  id: string;
  header: string;
  key: string;
  width?: string;
  sortable?: boolean;
  sortDirection?: 'ASC' | 'DESC' | 'NONE';
  formatter?: (cell: any, row: any) => React.ReactNode;
}

export interface TableAction {
  name: string;
  onClick: (selectedRows: Record<string, any>[]) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TableToolbarButton {
  text: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  kind?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
}

export interface TableProps {
  columns: TableColumn[];
  data: Record<string, any>[];
  title?: string;
  description?: string;
  showSearch?: boolean;
  showPagination?: boolean;
  className?: string;
  isSortable?: boolean;
  isSelectable?: boolean;
  toolbarButtons?: TableToolbarButton[];
  rowActions?: TableAction[];
  onRowClick?: (row: Record<string, any>) => void;
  emptyStateText?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  useZebraStyles?: boolean;
  stickyHeader?: boolean;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  density?: 'compact' | 'short' | 'tall' | 'normal';
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  title,
  description,
  showSearch = true,
  showPagination = true,
  className = '',
  isSortable = false,
  isSelectable = false,
  toolbarButtons = [],
  rowActions = [],
  onRowClick,
  emptyStateText = 'No data available',
  size = 'lg',
  useZebraStyles = false,
  stickyHeader = false,
  initialPageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  density = 'normal',
}) => {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [filteredData, setFilteredData] = React.useState(data);
  const [sortBy, setSortBy] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'ASC' | 'DESC' | 'NONE'>('NONE');
  const [selectedRows, setSelectedRows] = React.useState<Record<string, any>[]>([]);
  
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    
    if (!searchTerm) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(row => {
      return Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchTerm)
      );
    });
    
    setFilteredData(filtered);
  };

  const handleSort = (headerKey: string) => {
    if (!isSortable) return;
    
    let newDirection: 'ASC' | 'DESC' | 'NONE' = 'ASC';
    
    if (sortBy === headerKey) {
      if (sortDirection === 'ASC') newDirection = 'DESC';
      else if (sortDirection === 'DESC') newDirection = 'NONE';
      else newDirection = 'ASC';
    }
    
    setSortBy(newDirection === 'NONE' ? null : headerKey);
    setSortDirection(newDirection);
    
    if (newDirection === 'NONE') {
      setFilteredData([...data]);
      return;
    }
    
    const sorted = [...filteredData].sort((a, b) => {
      const valueA = a[headerKey];
      const valueB = b[headerKey];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return newDirection === 'ASC' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      if (valueA < valueB) return newDirection === 'ASC' ? -1 : 1;
      if (valueA > valueB) return newDirection === 'ASC' ? 1 : -1;
      return 0;
    });
    
    setFilteredData(sorted);
  };

  const handleRowSelection = (selectedRows: Record<string, any>[]) => {
    setSelectedRows(selectedRows);
  };

  const headers = columns.map(column => ({
    key: column.id,
    header: column.header,
    width: column.width,
    isSortable: isSortable && (column.sortable !== false),
  }));

  const rows = filteredData.map((row, index) => {
    const formattedRow: Record<string, any> = { id: `row-${index}` };
    
    columns.forEach(column => {
      const value = row[column.key];
      formattedRow[column.id] = column.formatter ? column.formatter(value, row) : value;
    });
    
    return formattedRow;
  });

  return (
    <div className={`${styles.tableWrapper} ${className}`}>
      <DataTable 
        rows={rows} 
        headers={headers}
        isSortable={isSortable}
        size={size}
        useZebraStyles={useZebraStyles}
        render={({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getSelectionProps,
          getTableProps,
          getTableContainerProps,
          getBatchActionProps,
          selectedRows: selectedRowsData,
        }) => {
          const actualSelectedRows = selectedRowsData.map(({ id }) => {
            const rowIndex = parseInt(id.split('-')[1]);
            return filteredData[rowIndex];
          });
          
          if (isSelectable && actualSelectedRows.length !== selectedRows.length) {
            handleRowSelection(actualSelectedRows);
          }
          
          return (
            <TableContainer
              title={title}
              description={description}
              {...getTableContainerProps()}
            >
              <TableToolbar className={styles.toolbar}>
                <TableToolbarContent>
                  {showSearch && (
                    <TableToolbarSearch
                      onChange={handleSearchChange}
                      placeholder="Search..."
                      className={styles.search}
                    />
                  )}
                  
                  {rowActions.length > 0 && isSelectable && selectedRows.length > 0 && (
                    <TableToolbarMenu>
                      {rowActions.map((action, index) => (
                        <TableToolbarAction
                          key={`action-${index}`}
                          onClick={() => action.onClick(selectedRows)}
                        >
                          {action.name}
                        </TableToolbarAction>
                      ))}
                    </TableToolbarMenu>
                  )}
                  
                  {toolbarButtons.map((button, index) => (
                    <Button
                      key={`toolbar-button-${index}`}
                      onClick={button.onClick}
                      disabled={button.disabled}
                      kind={button.kind || 'primary'}
                      size="sm"
                      className={styles.toolbarButton}
                    >
                      {button.icon && button.icon}
                      {button.text}
                    </Button>
                  ))}
                </TableToolbarContent>
              </TableToolbar>
              
              <CarbonTable {...getTableProps()} className={styles.table} useZebraStyles={useZebraStyles}>
                <TableHead>
                  <TableRow>
                    {isSelectable && (
                      <TableSelectAll {...getSelectionProps()} />
                    )}
                    {headers.map(header => (
                      <TableHeader
                        key={header.key}
                        {...getHeaderProps({
                          header,
                          isSortable: header.isSortable,
                          onClick: () => handleSort(header.key),
                          sortDirection: 
                            sortBy === header.key 
                              ? sortDirection === 'ASC' 
                                ? 'ASC'
                                : 'DESC'
                              : 'NONE',
                        })}
                      >
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={headers.length + (isSelectable ? 1 : 0)} className={styles.emptyState}>
                        {emptyStateText}
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.slice((page - 1) * pageSize, page * pageSize).map(row => (
                      <TableRow 
                        key={row.id} 
                        {...getRowProps({ row })}
                        onClick={() => onRowClick && onRowClick(filteredData[parseInt(row.id.split('-')[1])])}
                        className={onRowClick ? styles.clickableRow : ''}
                      >
                        {isSelectable && (
                          <TableSelectRow {...getSelectionProps({ row })} />
                        )}
                        {row.cells.map(cell => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </CarbonTable>
            </TableContainer>
          );
        }}
      />
    </div>
  );
};

export default Table;
