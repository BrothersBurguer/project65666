import { NextRequest, NextResponse } from "next/server";

const PUSHINPAY_BASE = "https://api.pushinpay.com.br/api";
const TOKEN = process.env.PUSHINPAY_TOKEN || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount } = body;

    if (!amount) {
      return NextResponse.json(
        { error: "Campo obrigatório: amount" },
        { status: 400 }
      );
    }

    const payload = {
      value: Math.round(amount * 100),
    };

    console.log("PushinPay payload:", JSON.stringify(payload));

    const response = await fetch(`${PUSHINPAY_BASE}/pix/cashIn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("PushinPay error:", JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: data.message || "Erro ao gerar cobrança PIX" },
        { status: response.status }
      );
    }

    console.log("PushinPay success:", JSON.stringify(data, null, 2));

    return NextResponse.json({
      copiaecola: data?.qr_code || "",
      qrcode_base64: data?.qr_code_base64 || "",
      txid: data?.id || "",
      status: data?.status || "created",
    });
  } catch (error) {
    console.error("PIX create error:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar pagamento" },
      { status: 500 }
    );
  }
}
