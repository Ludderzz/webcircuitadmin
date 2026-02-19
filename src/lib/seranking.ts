const SERANKING_API_URL = 'https://api4.seranking.com';
const SERANKING_DATA_URL = 'https://api.seranking.com/v1'; // Specifically for the Backlink/Data engine

export const SEO_ENDPOINTS = {
  // Project-specific (Project API)
  COMPETITORS: (siteId: string) => `/competitors/site/${siteId}`,
  RANKINGS: (siteId: string) => `/sites/${siteId}/keywords`,
  
  // Database-wide (Data API)
  BACKLINK_SUMMARY: (domain: string) => `/backlinks/summary?target=${domain}&target_type=domain`,
  DOMAIN_TRUST: (domain: string) => `/backlinks/metrics?target=${domain}&target_type=domain`
};

export async function seRankingFetch(endpoint: string, options: RequestInit = {}, useDataApi = false) {
  const baseUrl = useDataApi ? SERANKING_DATA_URL : SERANKING_API_URL;
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const response = await fetch(`${baseUrl}${formattedEndpoint}`, {
    ...options,
    headers: {
      'Authorization': `Token ${process.env.SERANKING_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`SE Ranking API [${baseUrl}] Failure [${response.status}]:`, errorBody);
    throw new Error(`SE Ranking Error: ${response.status}`);
  }

  return response.json();
}