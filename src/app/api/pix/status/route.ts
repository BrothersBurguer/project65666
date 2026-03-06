import { NextRequest, NextResponse } from "next/server";

const SIGILOPAY_BASE = "https://app.sigilopay.com.br/api/v1";
const PUBLIC_KEY = process.env.SIGILOPAY_PUBLIC_KEY || "";
const SECRET_KEY = process.env.SIGILOPAY_SECRET_KEY || "";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const txid = searchParams.get("txid");

    if (!txid) {
      return NextResponse.json(
        { error: "txid é obrigatório" },
        { status: 400 }
      );
    }

    // Try multiple endpoint/param formats for SigiloPay
    const urls = [
      `${SIGILOPAY_BASE}/gateway/transactions?transactionId=${txid}`,
      `${SIGILOPAY_BASE}/gateway/transactions?id=${txid}`,
      `${SIGILOPAY_BASE}/gateway/transactions?identifier=${txid}`,
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "x-public-key": PUBLIC_KEY,
            "x-secret-key": SECRET_KEY,
          },
        });

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          console.log(`SigiloPay status [${url}]: non-JSON response:`, text.slice(0, 100));
          continue;
        }

        console.log(`SigiloPay status [${url}]:`, response.status, JSON.stringify(data));

        if (response.ok) {
          const status = data?.status || data?.transaction?.status || "PENDING";
          return NextResponse.json({ status });
        }
      } catch (e) {
        console.error(`SigiloPay status error [${url}]:`, e);
      }
    }

    // Return PENDING instead of error to avoid spamming 400s in the browser
    return NextResponse.json({ status: "PENDING" });
  } catch (error) {
    console.error("PIX status error:", error);
    return NextResponse.json(
      { error: "Erro interno ao consultar pagamento" },
      { status: 500 }
    );
  }
}
