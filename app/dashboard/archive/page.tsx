'use client';

import { useState } from 'react';
import { Modal } from '@carbon/react';
import styles from '../dashboard.module.scss';
import CustomDataTable from '@/components/CustomDataTable';


const rows = [
  {
    id: '1',
    name: 'Yash',
    email: 'yash@mail.com',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Abhishek',
    email: 'abhishek@mail.com',
    status: 'Inactive',
  },
  {
    id: '3',
    name: 'Vashnavi',
    email: 'Vashnavi@mail.com',
    status: 'Active',
  },
];

export default function ArchivePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow] = useState<any>(null);

  return (
    <div className={styles.tableContainer}>
      {/* <h1 className="cds--type-productive-heading-05">Archive Records</h1> */}

      <CustomDataTable />

      <Modal
        open={isModalOpen}
        modalHeading="Record Details"
        primaryButtonText="Close"
        secondaryButtonText="Archive"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <div className={styles.modalContent}>
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
    </div>
  );
}