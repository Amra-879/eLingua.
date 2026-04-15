const paymentModel = require("../models/paymentModel");
const submissionModel = require("../models/submissionModel");
const { calculatePrice } = require("./submissionController");

const PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com";

const getAccessToken = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  if (!res.ok) throw new Error("Ne mogu dohvatiti PayPal token");
  return data.access_token;
};

// POST /api/payments/create-order
const createOrder = async (req, res) => {
  const { word_count } = req.body;
  const student_id = req.user.id;

  if (!word_count || word_count < 1) {
    return res.status(400).json({ message: "Broj riječi je obavezan" });
  }

  const amount = calculatePrice(word_count);

  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount.toFixed(2),
            },
            description: `eLingua esej — ${word_count} riječi`,
          },
        ],
      }),
    });

    const order = await response.json();

    if (!response.ok) {
      console.error("PAYPAL CREATE ORDER ERROR:", order);
      return res.status(500).json({ message: "Greška pri kreiranju PayPal narudžbe" });
    }

    paymentModel.createPayment(student_id, amount, order.id);

    res.json({
      orderId: order.id,
      amount: amount.toFixed(2),
    });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/payments/capture-order
const captureOrder = async (req, res) => {
  const { paypal_order_id, prompt_id, text_content, word_count } = req.body;
  const student_id = req.user.id;

  if (!paypal_order_id || !prompt_id || !text_content || !word_count) {
    return res.status(400).json({ message: "Sva polja su obavezna" });
  }

  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${paypal_order_id}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const capture = await response.json();

    // DEV ONLY — prihvati i ako PayPal vrati grešku
    const isCompleted = capture.status === "COMPLETED";
    const finalStatus = isCompleted ? "completed" : "pending";
    const captureId = isCompleted
      ? capture.purchase_units?.[0]?.payments?.captures?.[0]?.id
      : null;

    paymentModel.updatePaymentStatus(paypal_order_id, finalStatus, captureId);

    // kreiraj submission nakon paypal plaćanja
    const submission = submissionModel.createSubmission(
      student_id,
      prompt_id,
      "text",
      text_content,
      word_count
    );

    paymentModel.linkPaymentToSubmission(paypal_order_id, submission.lastInsertRowid);

    const amount = calculatePrice(word_count);

    res.status(201).json({
      message: "Esej uspješno poslan!",
      submission_id: submission.lastInsertRowid,
      amount: amount.toFixed(2),
    });

  } catch (err) {
    console.error("CAPTURE ORDER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const calculateAudioPrice = (seconds) => {
  if (seconds < 1) return 0;
  const base = 3.50;
  const baseSeconds = 60;
  const extraRate = 0.5;
  const extraInterval = 30;
  if (seconds <= baseSeconds) return base;
  const extraSeconds = seconds - baseSeconds;
  const extraChunks = Math.ceil(extraSeconds / extraInterval);
  return base + extraChunks * extraRate;
};

// POST /api/payments/create-audio-order
const createAudioOrder = async (req, res) => {
  const { duration } = req.body;
  const student_id = req.user.id;

  if (!duration || duration < 1) {
    return res.status(400).json({ message: "Trajanje je obavezno" });
  }

  const amount = calculateAudioPrice(duration);

  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount.toFixed(2),
            },
            description: `eLingua audio esej — ${duration} sekundi`,
          },
        ],
      }),
    });

    const order = await response.json();

    if (!response.ok) {
      return res.status(500).json({ message: "Greška pri kreiranju PayPal narudžbe" });
    }

    paymentModel.createPayment(student_id, amount, order.id);
    res.json({ orderId: order.id, amount: amount.toFixed(2) });
  } catch (err) {
    console.error("CREATE AUDIO ORDER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/payments/capture-audio-order
const captureAudioOrder = async (req, res) => {
  const { paypal_order_id, prompt_id, duration } = req.body;
  const student_id = req.user.id;
  const audio_file = req.file;

  if (!paypal_order_id || !prompt_id || !duration || !audio_file) {
    return res.status(400).json({ message: "Sva polja su obavezna" });
  }

  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${paypal_order_id}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const capture = await response.json();

    const isCompleted = capture.status === "COMPLETED";
    const finalStatus = isCompleted ? "completed" : "pending";
    const captureId = isCompleted
      ? capture.purchase_units?.[0]?.payments?.captures?.[0]?.id
      : null;

    paymentModel.updatePaymentStatus(paypal_order_id, finalStatus, captureId);

    const audio_url = `/uploads/audio/${audio_file.filename}`;

    const submission = submissionModel.createAudioSubmission(
      student_id,
      prompt_id,
      audio_url,
      duration
    );

    paymentModel.linkPaymentToSubmission(paypal_order_id, submission.lastInsertRowid);

    const amount = calculateAudioPrice(duration);

    res.status(201).json({
      message: "Audio esej uspješno poslan!",
      submission_id: submission.lastInsertRowid,
      amount: amount.toFixed(2),
    });
  } catch (err) {
    console.error("CAPTURE AUDIO ORDER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/payments/my
const getMyPayments = (req, res) => {
  const student_id = req.user.id;
  try {
    const payments = paymentModel.getPaymentsByStudent(student_id);
    res.json(payments);
  } catch (err) {
    console.error("GET MY PAYMENTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrder,
  captureOrder,
  createAudioOrder,
  captureAudioOrder,
  getMyPayments,
};