// Helper for Indian PIN code validation, city/state resolution and delivery timeline estimates

export interface PincodeInfo {
  city: string;
  state: string;
  estimatedDays: string;
  isDeliverable: boolean;
}

// Quick offline directory for instant resolution of major metro & tier-1 hubs
const PINCODE_PREFIX_MAP: Record<string, { city: string; state: string; days: string }> = {
  "11": { city: "New Delhi", state: "Delhi", days: "1-2 Business Days" },
  "12": { city: "Gurugram / Faridabad", state: "Haryana", days: "1-2 Business Days" },
  "20": { city: "Noida / Ghaziabad", state: "Uttar Pradesh", days: "1-2 Business Days" },
  "40": { city: "Mumbai", state: "Maharashtra", days: "2-3 Business Days" },
  "41": { city: "Pune", state: "Maharashtra", days: "2-3 Business Days" },
  "56": { city: "Bengaluru", state: "Karnataka", days: "2-3 Business Days" },
  "50": { city: "Hyderabad", state: "Telangana", days: "2-3 Business Days" },
  "60": { city: "Chennai", state: "Tamil Nadu", days: "2-3 Business Days" },
  "70": { city: "Kolkata", state: "West Bengal", days: "3-4 Business Days" },
  "38": { city: "Ahmedabad", state: "Gujarat", days: "2-3 Business Days" },
  "30": { city: "Jaipur", state: "Rajasthan", days: "2-3 Business Days" },
  "16": { city: "Chandigarh", state: "Punjab", days: "2-3 Business Days" },
  "68": { city: "Kochi", state: "Kerala", days: "3-4 Business Days" },
  "80": { city: "Patna", state: "Bihar", days: "3-4 Business Days" },
  "22": { city: "Lucknow", state: "Uttar Pradesh", days: "2-3 Business Days" },
  "45": { city: "Indore", state: "Madhya Pradesh", days: "2-3 Business Days" },
};

/**
 * Resolves city and state from an Indian 6-digit PIN code.
 * Checks fast prefix map first, then queries the public Indian Postal API if online.
 */
export async function lookupPincode(pincode: string): Promise<PincodeInfo | null> {
  const cleanPin = pincode.trim().replace(/\D/g, "");
  if (cleanPin.length !== 6) return null;

  const prefix = cleanPin.slice(0, 2);
  const fallback = PINCODE_PREFIX_MAP[prefix] || {
    city: "Standard Delivery Hub",
    state: "India",
    days: "3-5 Business Days",
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        return {
          city: postOffice.District || postOffice.Division || fallback.city,
          state: postOffice.State || fallback.state,
          estimatedDays: fallback.days,
          isDeliverable: true,
        };
      }
    }
  } catch {
    // If public API fails or times out, use reliable offline prefix mapping
  }

  return {
    city: fallback.city,
    state: fallback.state,
    estimatedDays: fallback.days,
    isDeliverable: true,
  };
}
