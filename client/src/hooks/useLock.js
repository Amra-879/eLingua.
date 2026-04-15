import { useEffect, useRef } from "react";

const BASE_URL = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");
const REFRESH_INTERVAL = 10 * 60 * 1000; // refresh svakih 3 minute

export default function useLock(submissionId) {
  const refreshRef = useRef(null);

  const acquireLock = async () => {
    try {
      const res = await fetch(`${BASE_URL}/lock/${submissionId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message, lockedBy: data.lockedBy };
      }
      return { success: true };
    } catch {
      return { success: false, message: "Greška pri zaključavanju" };
    }
  };

  const releaseLock = async () => {
    try {
      await fetch(`${BASE_URL}/lock/${submissionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    } catch {
      // tiho ignoriši grešku pri otpuštanju
    }
  };

  const startRefresh = () => {
    refreshRef.current = setInterval(async () => {
      try {
        await fetch(`${BASE_URL}/lock/${submissionId}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${getToken()}` },
        });
      } catch {}
    }, REFRESH_INTERVAL);
  };

  const stopRefresh = () => {
    if (refreshRef.current) {
      clearInterval(refreshRef.current);
      refreshRef.current = null;
    }
  };

  // otpusti lock kada korisnik napusti stranicu
  useEffect(() => {
    const handleBeforeUnload = () => {
      navigator.sendBeacon(
        `${BASE_URL}/lock/${submissionId}`,
      );
      releaseLock();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      stopRefresh();
      releaseLock();
    };
  }, [submissionId]);
}

  return { acquireLock, releaseLock, startRefresh, stopRefresh };
