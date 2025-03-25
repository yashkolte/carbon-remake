'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Modal,
  ClickableTile,
  AspectRatio,

} from '@carbon/react';
import { useRouter } from 'next/navigation';
import {
  Dashboard,
  Archive,
  Document,
  ChartColumn,
} from '@carbon/icons-react';
import styles from './dashboard.module.scss';

export default function DashboardPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tiles = [
    {
      title: 'Archive Data',
      description: 'View and manage archived records',
      icon: Archive,
      action: () => router.push('/dashboard/archive'),
    },
    {
      title: 'Products',
      description: 'View Products',
      icon: ChartColumn,
      action: () => router.push('/product'),
    },
    {
      title: 'Documents',
      description: 'Manage your documents',
      icon: Document,
      action: () => router.push('/shared'),
    },
    {
      title: 'Overview',
      description: 'System overview and status',
      icon: Dashboard,
      action: () => setIsModalOpen(true),
    },
  ];

  return (
    <div>
      <Grid>
        <Column lg={16} md={8} sm={4}>
          <h1 className="cds--type-productive-heading-05">Dashboard Overview</h1>
        </Column>
      </Grid>

      <div className={styles.tilesGrid}>
        {tiles.map((tile, index) => (
          <ClickableTile
            key={index}
            className={styles.tile}
            onClick={tile.action}
          >
            <AspectRatio ratio="1x1">
              <div className={styles.tileContent}>
                <tile.icon size={32} />
                <h3 className="cds--type-productive-heading-02">{tile.title}</h3>
                <p className="cds--type-body-long-01">{tile.description}</p>
              </div>
            </AspectRatio>
          </ClickableTile>
        ))}
      </div>

   

      <Modal
        open={isModalOpen}
        modalHeading="Feature Coming Soon"
        primaryButtonText="Close"
        onRequestClose={() => setIsModalOpen(false)}
        onRequestSubmit={() => setIsModalOpen(false)}
      >
        <div className={styles.modalContent}>
          <p>This feature is currently under development.</p>
        </div>
      </Modal>
    </div>
  );
}