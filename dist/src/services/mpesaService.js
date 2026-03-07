import axios from "axios";
import "dotenv/config";
async function getAccessToken() {
    const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET } = process.env;
    if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
        throw new Error("Missing MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET");
    }
    const tokenUrl = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64");
    console.log("MPESA_CONSUMER_KEY:", MPESA_CONSUMER_KEY);
    console.log("MPESA_CONSUMER_SECRET:", MPESA_CONSUMER_SECRET);
    console.log("Base64 auth:", Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64"));
    const response = await axios.get(tokenUrl, {
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.data.access_token) {
        throw new Error("Failed to obtain access token from M-Pesa");
    }
    return response.data.access_token;
}
export async function initiateStkPush(phoneNumber, amount, accountReference, transactionDesc = "Bet prediction purchase") {
    const { MPESA_SHORTCODE, MPESA_PASSKEY, MPESA_CALLBACK_URL } = process.env;
    if (!MPESA_SHORTCODE || !MPESA_PASSKEY || !MPESA_CALLBACK_URL) {
        throw new Error("Missing MPESA_SHORTCODE, MPESA_PASSKEY, or MPESA_CALLBACK_URL in .env");
    }
    // Format phone number to 2547XXXXXXXX
    const formattedNumber = phoneNumber.startsWith("0")
        ? "254" + phoneNumber.slice(1)
        : phoneNumber;
    const token = await getAccessToken();
    // Generate timestamp and password
    const timestamp = new Date()
        .toISOString()
        .replace(/[-T:\.Z]/g, "")
        .slice(0, 14); // YYYYMMDDHHmmss
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString("base64");
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const payload = {
        BusinessShortCode: Number(MPESA_SHORTCODE),
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: formattedNumber,
        PartyB: Number(MPESA_SHORTCODE),
        PhoneNumber: formattedNumber,
        CallBackURL: MPESA_CALLBACK_URL,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
    };
    try {
        const response = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        // Safaricom may return ResponseCode !== 0
        if (response.data.ResponseCode !== "0") {
            throw new Error(response.data.ResponseDescription || "STK Push request failed");
        }
        return response.data;
    }
    catch (err) {
        console.error("STK Push Error:", err.response?.data || err.message);
        throw new Error(err.response?.data?.errorMessage || err.message || "STK Push failed");
    }
}
//# sourceMappingURL=mpesaService.js.map