import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

const BASE_URL = "http://localhost:5000/api/payments";

const getToken = () => localStorage.getItem("token");

export default function PayPalButton({
  wordCount,
  getEditorContent,
  duration,
  getAudioData,
  type = "essay", // "essay" | "audio"
  onSuccess,
  onError,
}) {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <div className="w-full py-3 text-center text-gray-400 text-sm">
        Učitavanje PayPal-a...
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="w-full py-3 text-center text-red-400 text-sm">
        PayPal se nije učitao — provjeri Client ID
      </div>
    );
  }

  const handleCreateOrder = async () => {
    try {
      const endpoint =
        type === "audio"
          ? `${BASE_URL}/create-audio-order`
          : `${BASE_URL}/create-order`;

      const body =
        type === "audio"
          ? { duration }
          : { word_count: wordCount };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data.orderId;
    } catch (err) {
      onError(err.message || "Greška pri kreiranju narudžbe");
      throw err;
    }
  };

  const handleApprove = async (data) => {
    try {
      if (type === "audio") {
        const { audioBlob, prompt_id } = getAudioData();

        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");
        formData.append("paypal_order_id", data.orderID);
        formData.append("prompt_id", prompt_id);
        formData.append("duration", duration);

        const res = await fetch(`${BASE_URL}/capture-audio-order`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body: formData,
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message);
        onSuccess(result);

      } else {
        const { text_content, prompt_id } = getEditorContent();

        const res = await fetch(`${BASE_URL}/capture-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            paypal_order_id: data.orderID,
            prompt_id,
            text_content,
            word_count: wordCount,
          }),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message);
        onSuccess(result);
      }
    } catch (err) {
      onError(err.message || "Greška pri obradi plaćanja");
    }
  };


   return (
    <PayPalButtons
        key={type} // ← ovo forsira remount kada se type promijeni
        style={{
        layout: "horizontal",
        color: "blue",
        shape: "rect",
        label: "pay",
        height: 45,
        }}
        createOrder={handleCreateOrder}
        onApprove={handleApprove}
        onError={(err) => {
        console.error("PAYPAL ERROR:", err);
        onError("PayPal greška — pokušaj ponovo");
        }}
        onCancel={() => onError("Plaćanje je otkazano")}
    />
   );
}