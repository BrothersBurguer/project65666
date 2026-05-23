import { Header } from "@/components/layout/Header";
import { CategoryNav } from "@/components/layout/CategoryNav";
import { AlertBanner } from "@/components/home/AlertBanner";
import { CountdownTimer } from "@/components/home/CountdownTimer";
import { ProductSection } from "@/components/home/ProductSection";
import { ReviewSection } from "@/components/reviews/ReviewSection";
import { DeliveryBanner } from "@/components/home/LocationInfo";
import { getProductsByCategory } from "@/data/products";

export default function HomePage() {
  const combos = getProductsByCategory("combos");
  const burgers = getProductsByCategory("hamburguer-artesanal");
  const batatas = getProductsByCategory("batatas");
  const porcoes = getProductsByCategory("porcoes");
  const bebidas = getProductsByCategory("bebidas");
  const sobremesas = getProductsByCategory("sobremesas");

  return (
    <>
      <Header />
      <CategoryNav />

      <main className="mt-1 pb-24">
        <div className="max-w-5xl mx-auto px-5">
          <AlertBanner variant="success">
            <DeliveryBanner />
          </AlertBanner>

          <AlertBanner variant="promo">
            Aproveite nossa <b>promoção com preços irresistíveis</b> tão bons
            quanto um hambúrguer 🖤
          </AlertBanner>

          <ProductSection id="combos" title="Combos" products={combos} />

          <CountdownTimer />

          <ProductSection
            id="hamburguer-artesanal"
            title="Hambúrguer Artesanal"
            products={burgers}
          />

          <ProductSection id="batatas" title="Batatas" products={batatas} />

          <ProductSection id="porcoes" title="Porções" products={porcoes} />

          <ProductSection id="bebidas" title="Bebidas" products={bebidas} />

          <ProductSection
            id="sobremesas"
            title="Sobremesas"
            products={sobremesas}
          />
        </div>

        <ReviewSection />

        <div className="max-w-5xl mx-auto px-5">
          <CountdownTimer />
        </div>

      </main>
    </>
  );
}
