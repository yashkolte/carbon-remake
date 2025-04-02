// src/components/ProductDetails.tsx

import { FC, useState, useEffect } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Loading,
  Tag
} from '@carbon/react';
import { ArrowLeft } from '@carbon/icons-react';
import styles from './ProductDetails.module.scss';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductDetailsProps {
  productId: number;
}

const ProductDetails: FC<ProductDetailsProps> = ({ productId }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://dummyjson.com/products/${productId}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data: Product = await response.json();
        setProduct(data);
        setSelectedImage(data.thumbnail);
        setError(null);
      } catch (err) {
        setError(t('products.error'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, t]);

  const handleBackClick = () => {
    router.push('/product');
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loading description={t('products.loading')} withOverlay={false} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.error}>
        <h2>{error ?? t('products.error')}</h2>
        <Button
          kind="tertiary"
          renderIcon={ArrowLeft}
          onClick={handleBackClick}
        >
          {t('products.details.backToProducts')}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Breadcrumb>
          <BreadcrumbItem href="/product">{t('products.title')}</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>{product.title}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div className={styles.productDetail}>
        <div className={styles.productImages}>
          <img
            src={selectedImage}
            alt={product.title}
            className={styles.mainImage}
          />

          <div className={styles.thumbnailsContainer}>
            {[product.thumbnail, ...product.images].map((image) => (
              <button
                key={image} // Use the unique image URL as the key
                onClick={() => setSelectedImage(image)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedImage(image);
                  }
                }}
                className={`${styles.thumbnailButton} ${selectedImage === image ? styles.active : ''}`}
                aria-label={`${product.title} - Thumbnail`}
              >
                <img
                  src={image}
                  alt={`${product.title}`} // Simplified alt text
                  className={styles.thumbnail}
                />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.productInfo}>
          <div className={styles.category}>
            <Tag type="gray">{product.category}</Tag>
          </div>
          <h1 className={styles.title}>{product.title}</h1>
          <h2 className={styles.brand}>{product.brand}</h2>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.priceContainer}>
            <p className={styles.price}>
              {t('products.card.price', { amount: product.price.toFixed(2) })}
            </p>
            {product.discountPercentage > 0 && (
              <p className={styles.discount}>
                {t('products.card.discount', { percentage: product.discountPercentage })}
              </p>
            )}
          </div>

          <div className={styles.details}>
            <div className={styles.detailItem}>
              <p className={styles.label}>{t('products.details.rating')}</p>
              <p className={styles.value}>{product.rating}/5</p>
            </div>

            <div className={styles.detailItem}>
              <p className={styles.label}>{t('products.details.brand')}</p>
              <p className={styles.value}>{product.brand}</p>
            </div>

            <div className={styles.detailItem}>
              <p className={styles.label}>{t('products.details.category')}</p>
              <p className={styles.value}>{product.category}</p>
            </div>
          </div>

          <Button>{t('products.details.addToCart')}</Button>
          <Button
            kind="tertiary"
            renderIcon={ArrowLeft}
            onClick={handleBackClick}
            className={styles.backButton}
          >
            {t('products.details.backToProducts')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;