"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatters";
import { storeInfo } from "@/data/store-info";

type OrderBump = {
  id: string;
  name: string;
  description: string;
  oldPrice: number;
  price: number;
  image: string;
};

const orderBumps: OrderBump[] = [
  { id: "brownie", name: "Brownie de Chocolate", description: "Brownie artesanal de chocolate com pedaços derretidos!", oldPrice: 12.9, price: 9.9, image: "/images/products/brownie-chocolate.jpg" },
  { id: "onion", name: "Onion Rings", description: "Anéis de cebola empanados e fritos, crocantes por fora!", oldPrice: 18.9, price: 14.9, image: "/images/products/onion-rings.jpg" },
  { id: "fries", name: "Batata Cheddar e Bacon", description: "Porção de batata frita com cheddar cremoso e bacon crocante!", oldPrice: 24.9, price: 19.9, image: "/images/products/batata-cheddar-bacon.jpg" },
  { id: "nuggets", name: "Nuggets (10 un)", description: "10 nuggets de frango crocantes com molho especial!", oldPrice: 19.9, price: 15.9, image: "/images/products/nuggets.jpg" },
  { id: "milkshake", name: "Milk Shake Ovomaltine", description: "Milk shake cremoso de Ovomaltine com chantilly!", oldPrice: 21.9, price: 16.9, image: "/images/products/milk-shake-ovomaltine.jpg" },
  { id: "coca", name: "Coca-Cola 2 Litros", description: "Coca-Cola garrafa 2 litros geladinha para acompanhar!", oldPrice: 19.9, price: 14.9, image: "/images/products/coca-2l.jpg" },
];

type PixData = {
  qrcode?: string;
  qrcode_base64?: string;
  txid?: string;
  transaction_id?: string;
  copiaecola?: string;
  pix_code?: string;
  brcode?: string;
};

type CheckoutStep = "form" | "loading" | "pix" | "discount" | "confirmed";

export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, clearCart, removeItem, itemCount } = useCart();

  // Address
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [referencia, setReferencia] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);

  // Personal
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");

  // Delivery
  const [deliveryType, setDeliveryType] = useState<"free" | "fast">("free");
  const fastFee = 5.99;

  // Order bumps
  const [selectedBumps, setSelectedBumps] = useState<string[]>([]);

  // Observations
  const [observacoes, setObservacoes] = useState("");

  // PIX payment
  const [step, setStep] = useState<CheckoutStep>("form");
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [pixError, setPixError] = useState("");
  const [copied, setCopied] = useState(false);
  const [pollingMsg, setPollingMsg] = useState("");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [discountApplied, setDiscountApplied] = useState(false);

  const toggleBump = (id: string) => {
    setSelectedBumps((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const bumpsTotal = orderBumps
    .filter((b) => selectedBumps.includes(b.id))
    .reduce((sum, b) => sum + b.price, 0);

  const finalDeliveryFee = deliveryType === "fast" ? fastFee : deliveryFee;
  const discountPercent = discountApplied ? 0.2 : 0;
  const subtotalWithBumps = subtotal + bumpsTotal;
  const discountValue = subtotalWithBumps * discountPercent;
  const finalTotal = subtotalWithBumps - discountValue + finalDeliveryFee;

  // CEP lookup
  const buscarCep = async () => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;
    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setRua(data.logradouro || "");
        setBairro(data.bairro || "");
        setCidade(data.localidade || "");
        setUf(data.uf || "");
      }
    } catch { /* ignore */ }
    setLoadingCep(false);
  };

  const handleCepChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    setCep(digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits);
  };

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length > 6) {
      setTelefone(`(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`);
    } else if (digits.length > 2) {
      setTelefone(`(${digits.slice(0, 2)}) ${digits.slice(2)}`);
    } else {
      setTelefone(digits);
    }
  };

  const handleCpfChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length > 9) {
      setCpf(`${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`);
    } else if (digits.length > 6) {
      setCpf(`${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`);
    } else if (digits.length > 3) {
      setCpf(`${digits.slice(0, 3)}.${digits.slice(3)}`);
    } else {
      setCpf(digits);
    }
  };

  const isFormValid =
    cep.replace(/\D/g, "").length === 8 &&
    rua.trim() &&
    bairro.trim() &&
    nome.trim() &&
    telefone.replace(/\D/g, "").length >= 10 &&
    cpf.replace(/\D/g, "").length === 11;

  // Poll payment status
  const checkPaymentStatus = useCallback(async (txid: string) => {
    try {
      const res = await fetch(`/api/pix/status?txid=${txid}`);
      const data = await res.json();
      const status = data?.status?.toLowerCase?.() || data?.transaction?.status?.toLowerCase?.() || "";
      if (status === "paid" || status === "completed" || status === "approved" || status === "confirmed") {
        if (pollingRef.current) clearInterval(pollingRef.current);
        clearCart();
        setStep("confirmed");
      }
    } catch { /* ignore */ }
  }, [clearCart]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Create PIX charge
  const handleConfirm = async () => {
    if (!isFormValid) return;
    setStep("loading");
    setPixError("");

    try {
      const res = await fetch("/api/pix/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal,
          name: nome,
          email,
          phone: telefone.replace(/\D/g, ""),
          cpf: cpf.replace(/\D/g, ""),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPixError(data.error || "Erro ao gerar cobrança PIX");
        setStep("form");
        return;
      }

      setPixData(data);
      setStep("pix");

      // Start polling for payment status
      const txid = data.txid || data.transaction_id || data.id;
      if (txid) {
        setPollingMsg("Aguardando pagamento...");
        pollingRef.current = setInterval(() => checkPaymentStatus(txid), 5000);
      }
    } catch {
      setPixError("Erro de conexão. Tente novamente.");
      setStep("form");
    }
  };

  const handleCopyPix = async () => {
    const code = pixData?.copiaecola || pixData?.pix_code || pixData?.brcode || "";
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch { /* ignore */ }
  };

  const handleCheckManual = async () => {
    const txid = pixData?.txid || pixData?.transaction_id;
    if (!txid) return;
    setPollingMsg("Verificando pagamento...");
    await checkPaymentStatus(txid as string);
    if (step !== "confirmed") {
      setPollingMsg("Pagamento ainda não identificado. Aguarde alguns instantes.");
      setTimeout(() => setPollingMsg("Aguardando pagamento..."), 4000);
    }
  };

  // === EMPTY CART ===
  if (itemCount === 0 && step === "form") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-black mb-2">Seu carrinho está vazio</h1>
          <p className="text-gray-500 mb-6">Adicione alguns deliciosos hambúrgueres ao seu carrinho!</p>
          <Link href="/" className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">Ver Cardápio</Link>
        </div>
      </div>
    );
  }

  // === CONFIRMED ===
  if (step === "confirmed") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-black mb-2">Pagamento Confirmado!</h1>
          <p className="text-gray-500 mb-2">Seu pedido foi recebido e está sendo preparado.</p>
          <p className="text-gray-500 mb-6">Entrega estimada: {deliveryType === "fast" ? "10-25" : "30-50"} minutos</p>
          <Link href="/" className="bg-prime-green text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition">Fazer Novo Pedido</Link>
        </div>
      </div>
    );
  }

  // === DISCOUNT OFFER SCREEN ===
  if (step === "discount") {
    const previewDiscount = subtotalWithBumps * 0.2;
    const previewTotal = subtotalWithBumps - previewDiscount + finalDeliveryFee;

    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">
        <div className="text-center max-w-md w-full">
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#5A0001] to-[#8b0103] rounded-full flex items-center justify-center shadow-lg shadow-red-200">
              <span className="text-5xl">🎁</span>
            </div>
            <div className="absolute -top-2 -right-2 w-14 h-14 bg-prime-green rounded-full flex items-center justify-center text-white font-black text-lg animate-bounce shadow-lg shadow-green-200">
              20%
            </div>
          </div>

          <h1 className="text-2xl font-black text-gray-900 mb-2">Espere! Não vá embora!</h1>
          <p className="text-gray-500 mb-6">Temos uma oferta especial para você finalizar seu pedido agora:</p>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-prime-green rounded-2xl p-6 mb-6 shadow-lg shadow-green-100">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-prime-green text-3xl font-black">20% OFF</span>
            </div>
            <p className="text-gray-600 font-medium mb-4">Cupom de desconto aplicado automaticamente no seu pedido!</p>

            <div className="bg-white rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal:</span>
                <span>{formatPrice(subtotalWithBumps)}</span>
              </div>
              <div className="flex justify-between text-prime-green font-semibold">
                <span>Desconto (20%):</span>
                <span>- {formatPrice(previewDiscount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Entrega:</span>
                <span className="text-prime-green">{finalDeliveryFee === 0 ? "Grátis" : formatPrice(finalDeliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t-2 border-gray-100">
                <span>Novo Total:</span>
                <span className="text-prime-green">{formatPrice(previewTotal)}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center gap-1 text-xs text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Oferta por tempo limitado
            </div>
          </div>

          <button
            onClick={() => {
              setDiscountApplied(true);
              setPixData(null);
              setStep("form");
            }}
            className="w-full bg-prime-green text-white font-bold py-4 rounded-xl text-lg hover:bg-emerald-700 transition shadow-lg shadow-green-200 mb-3"
          >
            Quero meu desconto de 20%!
          </button>

          <button
            onClick={() => {
              setStep("form");
            }}
            className="w-full bg-gray-100 text-gray-500 font-medium py-3 rounded-xl text-sm hover:bg-gray-200 transition"
          >
            Não, obrigado. Voltar sem desconto.
          </button>
        </div>
      </div>
    );
  }

  // === PIX PAYMENT SCREEN ===
  if (step === "pix" && pixData) {
    const pixCode = pixData.copiaecola || pixData.pix_code || pixData.brcode || "";
    const qrBase64 = pixData.qrcode_base64 || pixData.qrcode || "";

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-black text-white py-4 sticky top-0 z-50">
          <div className="max-w-[600px] mx-auto px-5 flex items-center justify-center relative">
            <button onClick={() => { if (pollingRef.current) clearInterval(pollingRef.current); setStep("discount"); }} className="absolute left-5 p-2 rounded-full hover:bg-white/10 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            </button>
            <h1 className="font-semibold text-lg">Pagamento PIX</h1>
          </div>
        </div>

        <div className="max-w-[600px] mx-auto px-5 py-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">

            {/* Resumo */}
            <div className="bg-[#f8fafc] rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Resumo do Pedido:</h4>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Subtotal:</span>
                <span>{formatPrice(subtotalWithBumps)}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-sm mb-1 text-prime-green font-semibold">
                  <span>Desconto (20%):</span>
                  <span>- {formatPrice(discountValue)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Taxa de Entrega:</span>
                <span className="text-prime-green">{finalDeliveryFee === 0 ? "Grátis" : formatPrice(finalDeliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t-2 border-gray-200 mt-2">
                <span>Total a Pagar:</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* QR Code */}
            <h3 className="text-center font-semibold text-gray-800 text-lg mb-4">Pague com PIX</h3>
            <p className="text-center text-sm text-gray-500 mb-4">Escaneie o QR Code abaixo:</p>

            {qrBase64 && (
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-white rounded-xl border-2 border-gray-200">
                  {qrBase64.startsWith("data:") ? (
                    <img src={qrBase64} alt="QR Code PIX" className="w-52 h-52" />
                  ) : (
                    <img src={`data:image/png;base64,${qrBase64}`} alt="QR Code PIX" className="w-52 h-52" />
                  )}
                </div>
              </div>
            )}

            {/* Copia e Cola */}
            {pixCode && (
              <>
                <p className="text-center text-sm text-gray-500 mb-2">Ou copie o código e pague no app do seu banco:</p>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-3 font-mono text-xs break-all text-gray-600 max-h-20 overflow-y-auto">
                  {pixCode}
                </div>
                <button
                  onClick={handleCopyPix}
                  className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${copied ? "bg-prime-green text-white" : "bg-black text-white hover:bg-gray-800"}`}
                >
                  {copied ? "✓ Código copiado!" : "📋 Copiar código PIX"}
                </button>
              </>
            )}

            {/* Status polling */}
            {pollingMsg && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 text-center">
                <div className="inline-block w-4 h-4 border-2 border-blue-300 border-t-blue-700 rounded-full animate-spin mr-2 align-middle" />
                {pollingMsg}
              </div>
            )}

            {/* Já paguei button */}
            <button
              onClick={handleCheckManual}
              className="w-full mt-4 py-3 rounded-xl font-semibold bg-prime-green text-white hover:bg-emerald-700 transition flex items-center justify-center gap-2"
            >
              ✓ Já paguei
            </button>

            {/* Instruções */}
            <div className="mt-6 bg-[#f8fafc] rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Como pagar com PIX:</h4>
              <ol className="text-sm text-gray-500 space-y-2 list-decimal pl-5">
                <li>Abra o aplicativo do seu banco ou instituição financeira.</li>
                <li>Escolha a opção de pagar com PIX.</li>
                <li>Escaneie o QR Code acima ou selecione &quot;PIX Copia e Cola&quot;.</li>
                <li>Cole o código copiado e confirme os dados do pagamento.</li>
                <li>Após o pagamento, seu pedido será confirmado automaticamente.</li>
              </ol>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              Obrigado por escolher {storeInfo.name}!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // === LOADING ===
  if (step === "loading") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Gerando seu PIX...</h2>
          <p className="text-gray-500">Por favor, aguarde um momento.</p>
        </div>
      </div>
    );
  }

  // === CHECKOUT FORM ===
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-52">
      {/* === HEADER === */}
      <header>
        <div className="relative h-32 w-full overflow-hidden">
          <Image src={storeInfo.coverImage} alt="Cover" width={800} height={200} className="w-full h-full object-cover" priority />
        </div>
        <div className="flex flex-col items-center -mt-10 relative z-10">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
            <Image src={storeInfo.logo} alt={storeInfo.name} width={80} height={80} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="text-center mt-2">
          <h1 className="text-lg font-semibold text-black">{storeInfo.name}</h1>
          <div className="flex items-center justify-center gap-3 mt-2">
            <Link href="/carrinho" className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-black hover:text-black transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            </Link>
            {storeInfo.socialLinks.instagram && (
              <a href={storeInfo.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-black hover:text-black transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            )}
            <button className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 text-xs font-bold hover:border-black hover:text-black transition">i</button>
          </div>
          <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mt-2 pb-4 flex-wrap">
            <span>💰 Pedido Mínimo <b>{formatPrice(storeInfo.delivery.minOrder)}</b></span>
            <span>🏍️ <b>{storeInfo.delivery.deliveryTimeMin}-{storeInfo.delivery.deliveryTimeMax}</b> min</span>
            <span>• <span className="text-prime-green">Grátis</span></span>
          </div>
        </div>
      </header>

      <div className="max-w-[800px] mx-auto px-4 space-y-4">

        {/* Discount banner */}
        {discountApplied && (
          <div className="bg-gradient-to-r from-prime-green to-emerald-600 text-white rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-green-200">
            <span className="text-3xl">🎉</span>
            <div className="flex-1">
              <p className="font-bold text-lg">Cupom de 20% aplicado!</p>
              <p className="text-sm opacity-90">Você está economizando {formatPrice(discountValue)}</p>
            </div>
          </div>
        )}

        {/* Error message */}
        {pixError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{pixError}</div>
        )}

        {/* === ENDEREÇO === */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-[#f8fafc]">
            <div className="w-10 h-10 rounded-full bg-[#5A0001] text-white flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Endereço de Entrega</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">CEP *</label>
              <div className="flex gap-2">
                <input type="text" value={cep} onChange={(e) => handleCepChange(e.target.value)} placeholder="00000-000" className="flex-1 h-12 border-2 border-gray-200 px-4 rounded-xl text-base focus:border-black focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)] transition" />
                <button onClick={buscarCep} disabled={cep.replace(/\D/g, "").length !== 8 || loadingCep} className="bg-[#5A0001] text-white px-5 rounded-xl hover:bg-[#333] transition disabled:opacity-60 disabled:cursor-not-allowed shrink-0">
                  {loadingCep ? "..." : "🔍"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Rua / Logradouro *</label>
              <input type="text" value={rua} onChange={(e) => setRua(e.target.value)} className="w-full h-12 border-2 border-gray-200 px-4 rounded-xl text-base focus:border-black focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)] transition" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-800 mb-2">Número</label>
                <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} className="w-full h-12 border-2 border-gray-200 px-4 rounded-xl text-base focus:border-black focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)] transition" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-800 mb-2">Complemento</label>
                <input type="text" value={complemento} onChange={(e) => setComplemento(e.target.value)} placeholder="Apto, Bloco, Casa" className="w-full h-12 border-2 border-gray-200 px-4 rounded-xl text-base focus:border-black focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)] transition" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Bairro *</label>
              <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} className="w-full h-12 border-2 border-gray-200 px-4 rounded-xl text-base focus:border-black focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)] transition" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-800 mb-2">Cidade *</label>
                <input type="text" value={cidade} readOnly className="w-full h-12 border-2 border-gray-200 px-4 rounded-xl text-base bg-gray-50 text-gray-500" />
              </div>
              <div className="w-24">
                <label className="block text-sm font-semibold text-gray-800 mb-2">UF *</label>
                <input type="text" value={uf} readOnly maxLength={2} className="w-full h-12 border-2 border-gray-200 px-4 rounded-xl text-base bg-gray-50 text-gray-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Ponto de Referência</label>
              <input type="text" value={referencia} onChange={(e) => setReferencia(e.target.value)} placeholder="Ex: Próximo à padaria, portão azul..." className="w-full h-12 border-2 border-gray-200 px-4 rounded-xl text-base focus:border-black focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)] transition" />
            </div>
          </div>
        </section>

        {/* === SEUS DADOS === */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-[#f8fafc]">
            <div className="w-10 h-10 rounded-full bg-[#5A0001] text-white flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Seus Dados</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Nome Completo *</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full h-12 border-2 border-gray-200 px-4 rounded-xl text-base focus:border-black focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)] transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Telefone (WhatsApp) *</label>
              <input type="tel" value={telefone} onChange={(e) => handlePhoneChange(e.target.value)} placeholder="(00) 00000-0000" className="w-full h-12 border-2 border-gray-200 px-4 rounded-xl text-base focus:border-black focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)] transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu.email@exemplo.com" className="w-full h-12 border-2 border-gray-200 px-4 rounded-xl text-base focus:border-black focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)] transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">CPF *</label>
              <input type="text" value={cpf} onChange={(e) => handleCpfChange(e.target.value)} placeholder="000.000.000-00" className="w-full h-12 border-2 border-gray-200 px-4 rounded-xl text-base focus:border-black focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)] transition" />
            </div>
          </div>
        </section>

        {/* === PAGAMENTO === */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-[#f8fafc]">
            <div className="w-10 h-10 rounded-full bg-[#5A0001] text-white flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Forma de Pagamento</h2>
          </div>
          <div className="border-2 border-prime-green rounded-2xl p-5 bg-gradient-to-br from-green-50 to-emerald-50 shadow-[0_4px_20px_rgba(7,124,34,0.15)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-prime-green text-white rounded-xl flex items-center justify-center text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><rect width="5" height="5" x="16" y="16" rx="1"/><rect width="5" height="5" x="9.5" y="9.5" rx="1"/></svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-gray-800">PIX</span>
                  <span className="bg-prime-green text-white text-[11px] px-2.5 py-0.5 rounded-full font-semibold uppercase">Recomendado</span>
                </div>
                <p className="text-sm text-gray-500">Pagamento instantâneo e seguro.</p>
              </div>
            </div>
            <div className="flex gap-4 mt-3 text-xs text-prime-green font-medium">
              <span>✓ Sem taxas</span>
              <span>✓ Confirmação rápida</span>
            </div>
            <div className="mt-3 p-3 bg-white rounded-xl border border-gray-200 text-sm text-gray-500 leading-relaxed">
              Após confirmar o pedido, você receberá um QR Code para pagamento. O pagamento é processado instantaneamente.
            </div>
          </div>
        </section>

        {/* === OPÇÕES DE ENTREGA === */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-[#f8fafc]">
            <div className="w-10 h-10 rounded-full bg-[#5A0001] text-white flex items-center justify-center shrink-0">🏍️</div>
            <h2 className="text-lg font-semibold text-gray-800">Opções de entrega</h2>
          </div>
          <div className="space-y-3">
            <button onClick={() => setDeliveryType("free")} className={`w-full text-left rounded-2xl p-5 border-2 transition-all ${deliveryType === "free" ? "border-prime-green bg-gradient-to-br from-green-50 to-emerald-50 shadow-[0_4px_20px_rgba(7,124,34,0.15)]" : "border-gray-200 bg-[#f8fafc] hover:shadow-md"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${deliveryType === "free" ? "bg-prime-green" : "bg-black"}`}>🚚</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">Frete Grátis</span>
                    <span className="bg-prime-green text-white text-[11px] px-2.5 py-0.5 rounded-full font-semibold">Recomendado</span>
                  </div>
                  <p className="text-sm text-gray-500">Tempo de entrega: 30 a 50 minutos</p>
                </div>
              </div>
              <div className="flex gap-4 mt-3 ml-15 text-xs text-prime-green font-medium">
                <span>✓ Sem custo adicional</span>
                <span>✓ Entrega padrão</span>
              </div>
            </button>
            <button onClick={() => setDeliveryType("fast")} className={`w-full text-left rounded-2xl p-5 border-2 transition-all ${deliveryType === "fast" ? "border-prime-green bg-gradient-to-br from-green-50 to-emerald-50 shadow-[0_4px_20px_rgba(7,124,34,0.15)]" : "border-gray-200 bg-[#f8fafc] hover:shadow-md"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${deliveryType === "fast" ? "bg-prime-green" : "bg-black"}`}>🚀</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">Frete Rápido</span>
                  </div>
                  <p className="text-sm text-gray-500">Tempo de entrega: 10 a 25 minutos</p>
                </div>
              </div>
              <div className="flex gap-4 mt-3 ml-15 text-xs font-medium">
                <span className="text-prime-green">⚡ Entrega expressa</span>
                <span className="text-prime-green">🕐 Prioridade máxima</span>
              </div>
              {deliveryType === "fast" && (
                <div className="mt-3 p-3 bg-white rounded-xl border border-gray-200 text-sm text-gray-500">Valor: R$ {fastFee.toFixed(2).replace(".", ",")}</div>
              )}
            </button>
          </div>
        </section>

        {/* === RESUMO DO PEDIDO === */}
        <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="bg-gradient-to-r from-[#8b0103] to-[#3e0001] text-white px-5 py-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">🛍️ Resumo do Pedido</h3>
            <div className="flex justify-between text-sm mt-2 opacity-90">
              <span>{itemCount} {itemCount === 1 ? "item" : "itens"}</span>
              <span>Entrega {deliveryType === "free" ? "Grátis" : formatPrice(fastFee)}</span>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-4 bg-[#f8fafc] rounded-xl border border-gray-200 hover:-translate-y-0.5 hover:shadow-md transition-all">
                <Image src={item.product.image} alt={item.product.name} width={60} height={60} className="w-15 h-15 rounded-xl object-cover border border-gray-200 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{item.quantity}x {item.product.name}</p>
                  {item.selectedExtras.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.selectedExtras.map((e) => (
                        <span key={e.extra.id} className="text-xs bg-white px-2 py-1 rounded-md text-gray-500">+ {e.extra.name}</span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="font-bold text-prime-green text-lg whitespace-nowrap">{formatPrice(item.unitTotal * item.quantity)}</span>
                <button onClick={() => removeItem(item.id)} className="w-9 h-9 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition shrink-0 text-sm">✕</button>
              </div>
            ))}
          </div>
        </section>

        {/* === ORDER BUMPS === */}
        {orderBumps.map((bump) => {
          const selected = selectedBumps.includes(bump.id);
          return (
            <div
              key={bump.id}
              onClick={() => toggleBump(bump.id)}
              className={`rounded-2xl overflow-hidden border-3 border-dashed cursor-pointer transition-all ${selected ? "border-prime-green bg-gradient-to-br from-green-50 to-emerald-50" : "border-[#5A0001] bg-white"}`}
            >
              <div className={`text-center text-white text-sm font-bold py-2.5 uppercase tracking-wider ${selected ? "bg-gradient-to-r from-prime-green to-emerald-700" : "bg-gradient-to-r from-[#840002] to-[#610002]"}`}>
                Adicione {bump.name}!
              </div>
              <div className="flex items-center gap-4 p-5">
                <Image src={bump.image} alt={bump.name} width={80} height={80} className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-lg text-gray-800">{bump.name}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{bump.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="line-through text-gray-400 text-sm">{formatPrice(bump.oldPrice)}</span>
                    <span className="text-prime-green font-bold text-lg">{formatPrice(bump.price)}</span>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 transition ${selected ? "bg-prime-green border-prime-green" : "border-gray-300 bg-white"}`}>
                  {selected && <span className="text-white text-xs font-bold">✓</span>}
                </div>
              </div>
            </div>
          );
        })}

        {/* === OBSERVAÇÕES === */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-[#f8fafc]">
            <div className="w-10 h-10 rounded-full bg-[#5A0001] text-white flex items-center justify-center shrink-0">💬</div>
            <h2 className="text-lg font-semibold text-gray-800">Observações do Pedido</h2>
          </div>
          <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={3} placeholder="Alguma observação especial sobre seu pedido?" className="w-full border-2 border-gray-200 p-4 rounded-xl text-base resize-none focus:border-black focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)] transition" />
        </section>
      </div>

      {/* === BARRA FIXA INFERIOR === */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t-2 border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-50">
        <div className="max-w-[800px] mx-auto px-5 py-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Subtotal:</span>
            <span>{formatPrice(subtotalWithBumps)}</span>
          </div>
          {discountApplied && (
            <div className="flex justify-between text-sm mb-1">
              <span className="text-prime-green font-semibold">Desconto (20%):</span>
              <span className="text-prime-green font-semibold">- {formatPrice(discountValue)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Taxa de Entrega:</span>
            <span className="text-prime-green font-medium">{finalDeliveryFee === 0 ? "Grátis" : formatPrice(finalDeliveryFee)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-3 border-t-2 border-gray-100 mb-3">
            <span>Total:</span>
            <span className="text-prime-green">{formatPrice(finalTotal)}</span>
          </div>
          <button
            onClick={handleConfirm}
            disabled={!isFormValid}
            className="w-full bg-prime-green text-white font-semibold py-4 rounded-xl text-base hover:bg-emerald-700 transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            ✓ Confirmar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
