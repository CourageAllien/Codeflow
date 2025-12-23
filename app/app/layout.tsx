// Optional auth check - works in sandbox mode without Clerk keys
function checkAuth() {
  const hasClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY;
  
  if (!hasClerkKeys) {
    // Sandbox mode - allow access
    return true;
  }
  
  // In production with Clerk, this would check authentication
  // For now, allow access
  return true;
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = checkAuth();

  if (!isAuthenticated) {
    // This would redirect in production
    // For sandbox mode, we allow access
  }

  return <>{children}</>;
}

