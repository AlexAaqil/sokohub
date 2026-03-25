export const config = {
  appName: import.meta.env.VITE_APP_NAME || 'Sokohub',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || "Kenya's Marketplace Network",
  
  // Logo configuration
  // For "Sokohub", you can split as { first: "Soko", second: "hub" }
  // For "MyDuka", you can split as { first: "My", second: "Duka" }
  // Or use a single name with no special styling
  logo: {
    first: import.meta.env.VITE_APP_LOGO_FIRST || 'Soko',
    second: import.meta.env.VITE_APP_LOGO_SECOND || 'hub',
    // If you want a single name without split styling, set useSplit: false
    useSplit: import.meta.env.VITE_APP_USE_SPLIT_LOGO === 'true' || true,
  },
  apiUrl: import.meta.env.VITE_API_URL || '/api',
} as const;