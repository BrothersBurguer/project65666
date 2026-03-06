import { StoreInfo } from "@/types/StoreInfo";

export const storeInfo: StoreInfo = {
  name: "Brother's Burger",
  logo: "/images/logo.png",
  coverImage: "/images/cover.png",
  rating: 4.9,
  reviewCount: 2136,
  socialLinks: {
    instagram: "https://www.instagram.com/oficialprimeburguer/",
  },
  openHours: {
    open: 8,
    close: 2,
  },
  delivery: {
    minOrder: 10,
    deliveryTimeMin: 30,
    deliveryTimeMax: 50,
    deliveryFee: 0,
    deliveryTypes: ["Entrega Motoboy", "Retirada"],
    paymentMethods: ["Pix"],
    address: "Sua Cidade - UF",
    deliveryAreas: ["Sua Cidade - UF"],
  },
};
