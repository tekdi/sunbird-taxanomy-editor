export interface SimulateApiResponse {
  url: string;
  method: string;
  data?: unknown;
  status: number;
}

export async function simulateApiCall(
  url: string,
  method: string,
  data?: unknown
): Promise<SimulateApiResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ url, method, data, status: 200 });
    }, 600);
  });
}

export function formatDate(date: Date | string) {
  const d = new Date(date);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[d.getMonth()];
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
}
