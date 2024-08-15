import { clsx } from "clsx";
// import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
// import { Buffer } from "buffer";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// export const useLocalStorage = (key, defaultValue = null) => {
//   const [value, setValue] = useState(() => {
//     try {
//       const saved = localStorage.getItem(key);
//       if (saved !== null) {
//         return JSON.parse(saved);
//       }
//       return defaultValue;
//     } catch {
//       return defaultValue;
//     }
//   });

//   useEffect(() => {
//     const rawValue = JSON.stringify(value);
//     localStorage.setItem(key, rawValue);
//   }, [key, value]);

//   return [value, setValue];
// };

// export function saveAuthTokens(access, refresh) {
//   if (access) {
//     localStorage.setItem("access_token", access);
//   }

//   if (refresh) {
//     localStorage.setItem("refresh_token", refresh);
//   }
// }

// export function getAuthTokens() {
//   return {
//     access_token: localStorage.getItem("access_token"),
//     refresh_token: localStorage.getItem("refresh_token"),
//   };
// }

// export function clearAuthTokens() {
//   localStorage.removeItem("access_token");
//   localStorage.removeItem("refresh_token");
// }

// export async function getSignature(nonce, publicAddress, provider) {
//   const message = `0x${Buffer.from(nonce, "utf-8").toString("hex")}`;
//   const sign = await provider.provider.request({
//     method: "personal_sign",
//     params: [message, publicAddress],
//   });

//   return sign;
// }
