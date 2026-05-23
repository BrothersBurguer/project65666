export type DeliveryInfo = {
  minOrder: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryFee: number;
  deliveryTypes: string[];
  paymentMethods: string[];
  address: string;
  deliveryAreas: string[];
};

export type StoreInfo = {
  name: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  socialLinks: {
    instagram?: string;
  };
  openHours: {
    open: number;
    close: number;
  };
  delivery: DeliveryInfo;
};
