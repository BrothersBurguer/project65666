import { NextRequest, NextResponse } from "next/server";

const PUSHINPAY_BASE = "https://api.pushinpay.com.br/api";
const TOKEN = process.env.PUSHINPAY_TOKEN || "";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const txid = searchParams.get("txid");

    if (!txid) {
      return NextResponse.json({ error: "txid é obrigatório" }, { status: 400 });
    }

    const response = await fetch(
      `${PUSHINPAY_BASE}/transactions/${txid}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    const data = await response.json();
    console.log(`PushinPay status [${txid}]:`, response.status, JSON.stringify(data));

    if (response.ok) {
      return NextResponse.json({ status: data?.status || "created" });
    }

    return NextResponse.json({ status: "created" });
  } catch (error) {
    console.error("PIX status error:", error);
    return NextResponse.json(
      { error: "Erro interno ao consultar pagamento" },
      { status: 500 }
    );
  }
}
