import React, { useState } from "react";
import {
  DataTable,
  TableContainer,
  TableToolbar,
  TableBatchActions,
  TableBatchAction,
  TableToolbarContent,
  TableToolbarSearch,
  Table,
  TableHead,
  TableRow,
  TableSelectAll,
  TableHeader,
  TableBody,
  TableSelectRow,
  TableCell,
  Modal
} from "@carbon/react";
import { Save} from "@carbon/icons-react";

interface Header {
  key: string;
  header: string;
}

interface Row {
  id: string;
  name: string;
  email: string;
  status: string;
  [key: string]: string | number;
}

const CustomDataTable: React.FC = () => {
  const [headers, setHeaders] = useState<Header[]>([
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "status", header: "Status" },
  ]);

  const [rows, setRows] = useState<Row[]>([
    { id: "1", name: "Server A", email: "servera@example.com", status: "Running" },
    { id: "2", name: "Server B", email: "serverb@example.com", status: "Stopped" },
    { id: "3", name: "Server C", email: "serverc@example.com", status: "Running" }
  ]);

   () => {
    const length = headers.length;
    const newHeader: Header = {
      key: `header_${length}`,
      header: `Header ${length}`
    };
    setHeaders([...headers, newHeader]);
    setRows(rows.map(row => ({ ...row, [newHeader.key]: newHeader.header })));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const handleSaveClick = (selectedRows: any) => {
    if (selectedRows.length > 0) {
      setSelectedRow(selectedRows[0]);
      setIsModalOpen(true);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <DataTable
        rows={rows}
        headers={headers}
        render={({
          rows,
          headers,
          getHeaderProps,
          getSelectionProps,
          getToolbarProps,
          getBatchActionProps,
          getRowProps,
          onInputChange,
          selectedRows,
          getTableProps,
          getTableContainerProps
        }) => {
          const batchActionProps = getBatchActionProps();
          return (
            <TableContainer
              title="Archive Table"
              description="Use the toolbar to save the status"
              {...getTableContainerProps()}
              style={{ width: '80%' }}
            >
              <TableToolbar {...getToolbarProps()}>
                <TableBatchActions {...getBatchActionProps()}>
                  <TableBatchAction 
                    renderIcon={Save} 
                    iconDescription="Save the selected rows"
                    onClick={() => handleSaveClick(selectedRows)}
                  >
                    Save
                  </TableBatchAction>
                </TableBatchActions>
                <TableToolbarContent aria-hidden={batchActionProps.shouldShowBatchActions}>
                  <TableToolbarSearch tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0} onChange={(event) => {
                    if (typeof event !== 'string') {
                      onInputChange(event);
                    }
                  }} />
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()} aria-label="sample table">
                <TableHead>
                  <TableRow>
                    <TableSelectAll {...getSelectionProps()} />
                    {headers.map((header) => (
                      <TableHeader {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
                    <TableRow {...getRowProps({ row })}>
                      <TableSelectRow {...getSelectionProps({ row })} />
                      {row.cells.map(cell => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Modal
                open={isModalOpen}
                modalHeading="Record Details"
                primaryButtonText="Close"
                secondaryButtonText="Archive"
                onRequestClose={() => setIsModalOpen(false)}
              >
                <div>
                  {selectedRow && (
                    <>
                      <p>ID: {selectedRow.cells[0].value}</p>
                      <p>Name: {selectedRow.cells[1].value}</p>
                      <p>Email: {selectedRow.cells[2].value}</p>
                      <p>Status: {selectedRow.cells[3].value}</p>
                    </>
                  )}
                </div>
              </Modal>
            </TableContainer>
          );
        }}
        />
    </div>
        
  );
};

export default CustomDataTable;
