// pages/product/[id].tsx

"use client";

import ProductDetails from '@/components/ProductDetails';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function ProductPage() {
  const params = useParams();
  const id = params.id;
  const { t } = useTranslation('common');

  if (!id) return <div>{t('products.loading')}</div>;

  return <ProductDetails productId={Number(id)} />;
}