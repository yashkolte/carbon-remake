// pages/index.tsx
"use client";
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Loading, ContentSwitcher, Switch } from '@carbon/react';
import ProductCard from '@/components/ProductCard';
import styles from './products.module.scss';
import { useTranslation } from 'react-i18next';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  brand: string;
  category: string;
  discountPercentage: number;
  rating: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation('common');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('https://dummyjson.com/products');
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(t('products.error'));
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [t]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loading description={t('products.loading')} withOverlay={false} />
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <>
      <Head>
        <title>{t('products.pageTitle')}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('products.title')}</h1>
          <div className={styles.filterControls}>
            <ContentSwitcher
              onChange={() => { }}
              selectedIndex={0}
              size="md"
            >
              <Switch name="all" text={t('products.filters.all')} />
              <Switch name="featured" text={t('products.filters.featured')} />
              <Switch name="sale" text={t('products.filters.onSale')} />
            </ContentSwitcher>
          </div>
        </div>

        <div className={styles.productsGrid}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}