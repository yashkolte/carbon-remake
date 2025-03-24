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
        setError('Failed to fetch product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (productId) {
      fetchProduct();
    }
  }, [productId]);
  
  const handleBackClick = () => {
    router.push('/');
  };
  
  if (loading) {
    return (
      <div className={styles.loading}>
        <Loading description="Loading product details..." withOverlay={false} />
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className={styles.error}>
        <h2>{error || 'Product not found'}</h2>
        <Button
          kind="tertiary"
          renderIcon={ArrowLeft}
          onClick={handleBackClick}
        >
          Back to Products
        </Button>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Breadcrumb>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
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
            {[product.thumbnail, ...product.images].map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`${product.title} - Image ${index + 1}`} 
                className={`${styles.thumbnail} ${selectedImage === image ? styles.active : ''}`}
                onClick={() => setSelectedImage(image)}
              />
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
            <p className={styles.price}>${product.price.toFixed(2)}</p>
            {product.discountPercentage > 0 && (
              <p className={styles.discount}>{product.discountPercentage}% off</p>
            )}
          </div>
          
          <div className={styles.details}>
            <div className={styles.detailItem}>
              <p className={styles.label}>Rating</p>
              <p className={styles.value}>{product.rating}/5</p>
            </div>
            
            <div className={styles.detailItem}>
              <p className={styles.label}>Stock</p>
              <p className={styles.value}>{product.stock} units</p>
            </div>
          </div>
          
          <Button>Add to Cart</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;