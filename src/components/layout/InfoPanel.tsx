import { storeInfo } from "@/data/store-info";

export function InfoPanel() {
  return (
    <div id="info" className="scroll-mt-20">
      <div className="max-w-5xl mx-auto px-5 py-8">
        <div className="bg-white border-2 border-prime-border rounded-2xl p-6 max-w-lg mx-auto">
          <h2 className="text-lg font-bold text-black mb-4">
            Tipos de Entrega
          </h2>
          {storeInfo.delivery.deliveryTypes.map((type) => (
            <p key={type} className="text-sm mb-1">
              {type === "Entrega Motoboy" ? "🏍️" : "📦"} {type}
            </p>
          ))}

          <h2 className="text-lg font-bold text-black mt-6 mb-4">
            Formas de Pagamento
          </h2>
          {storeInfo.delivery.paymentMethods.map((method) => (
            <p key={method} className="text-sm mb-1">
              ✅ {method}
            </p>
          ))}

          <h2 className="text-lg font-bold text-black mt-6 mb-4">Endereço</h2>
          <p className="text-sm">{storeInfo.delivery.address}</p>

          <h2 className="text-lg font-bold text-black mt-6 mb-4">
            Áreas de Entrega
          </h2>
          {storeInfo.delivery.deliveryAreas.map((area) => (
            <div key={area} className="text-sm mb-1">
              <h3 className="font-semibold">{area}</h3>
              <span className="text-prime-green font-bold">GRÁTIS (hoje)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
