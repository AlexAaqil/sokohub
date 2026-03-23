export interface Shop {
  id: string;
  name: string;
  description: string;
  category: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewsCount: number;
  productsCount: number;
  salesCount: number;
  isOpen: boolean;
  createdAt: Date;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  stock: number;
  category: string;
  images: string[];
  status: 'active' | 'low-stock' | 'out-of-stock';
  createdAt: Date;
}

export interface Deal extends Product {
  discountPercentage: number;
  endsAt: Date;
}

export interface Post {
  id: string;
  shopId: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: Date;
  verified?: boolean;
}