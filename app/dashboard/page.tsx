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
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation('common');

  const tiles = [
    {
      title: t('dashboard.tiles.archiveData.title'),
      description: t('dashboard.tiles.archiveData.description'),
      icon: Archive,
      action: () => router.push('/dashboard/archive'),
    },
    {
      title: t('dashboard.tiles.products.title'),
      description: t('dashboard.tiles.products.description'),
      icon: ChartColumn,
      action: () => router.push('/product'),
    },
    {
      title: t('dashboard.tiles.documents.title'),
      description: t('dashboard.tiles.documents.description'),
      icon: Document,
      action: () => router.push('/dashboard/document'),
    },
    {
      title: t('dashboard.tiles.overview.title'),
      description: t('dashboard.tiles.overview.description'),
      icon: Dashboard,
      action: () => router.push('/dashboard/submitform'),
      // action: () => setIsModalOpen(true),
    },
  ];

  return (
    <div>
      <Grid>
        <Column lg={16} md={8} sm={4}>
          <h1 className="cds--type-productive-heading-05">{t('dashboard.overview')}</h1>
        </Column>
      </Grid>

      <div className="tilesGrid">
        {tiles.map((tile, index) => (
          <ClickableTile
            key={tile.title}
            className="tile"
            onClick={tile.action}
          >
            <AspectRatio ratio="1x1">
              <div className="tileContent">
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
        modalHeading={t('dashboard.modal.comingSoon')}
        primaryButtonText={t('dashboard.modal.close')}
        onRequestClose={() => setIsModalOpen(false)}
        onRequestSubmit={() => setIsModalOpen(false)}
      >
        <div className="modalContent">
          <p>{t('dashboard.modal.underDevelopment')}</p>
        </div>
      </Modal>
    </div>
  );
}