// src/components/ProductCard.tsx

import Link from 'next/link';
import { Tag } from '@carbon/react';
import { useTranslation } from 'react-i18next';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  brand: string;
  category: string;
  discountPercentage?: number;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { t } = useTranslation('common');

  // Ensure a fallback href if product.id is invalid
  const productHref = product.id ? `/product/${product.id}` : '#';

  return (
    <Link href={productHref} passHref legacyBehavior>
      <a className="productCard">
        <div className="imageContainer">
          <img
            src={product.thumbnail}
            alt={product.title} // Use the product title as the alt text
            className="thumbnail"
          />
        </div>
        <div className="content">
          <div className="categoryTag">
            <Tag type="gray" size="sm">{product.category}</Tag>
          </div>
          <h3 className="title">{product.title}</h3>
          <p className="description">{product.description}</p>
          <div className="priceContainer">
            <p className="price">
              {t('products.card.price', { amount: product.price.toFixed(2) })}
            </p>
            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className="discount">
                {t('products.card.discount', { percentage: product.discountPercentage })}
              </span>
            )}
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ProductCard;