import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const SIGILOPAY_BASE = "https://app.sigilopay.com.br/api/v1";
const PUBLIC_KEY = process.env.SIGILOPAY_PUBLIC_KEY || "";
const SECRET_KEY = process.env.SIGILOPAY_SECRET_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, name, email, phone, cpf } = body;

    if (!amount || !name || !cpf) {
      return NextResponse.json(
        { error: "Campos obrigatórios: amount, name, cpf" },
        { status: 400 }
      );
    }

    const payload = {
      identifier: randomUUID(),
      amount: Math.round(amount * 100) / 100,
      client: {
        name: String(name),
        email: String(email || ""),
        phone: String(phone || ""),
        document: String(cpf.replace(/\D/g, "")),
      },
    };

    console.log("SigiloPay payload:", JSON.stringify(payload));

    const response = await fetch(`${SIGILOPAY_BASE}/gateway/pix/receive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-public-key": PUBLIC_KEY,
        "x-secret-key": SECRET_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("SigiloPay error:", JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: data.message || "Erro ao gerar cobrança PIX" },
        { status: response.status }
      );
    }

    console.log("SigiloPay success:", JSON.stringify(data, null, 2));

    // Normalize response for frontend
    const normalized = {
      copiaecola: data?.pix?.code || "",
      qrcode_base64: data?.pix?.base64 || "",
      txid: data?.transactionId || "",
      status: data?.status || "PENDING",
    };

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("PIX create error:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar pagamento" },
      { status: 500 }
    );
  }
}
