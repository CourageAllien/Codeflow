export default function TestPage() {
  return (
    <div style={{ padding: '2rem', background: '#0a0a0b', color: '#fafafa', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Test Page</h1>
      <p>If you can see this, the app is working!</p>
      <p style={{ marginTop: '1rem', color: '#a1a1aa' }}>
        This is a simple test to verify basic rendering works.
      </p>
      <a href="/" style={{ color: '#22c55e', textDecoration: 'underline', marginTop: '1rem', display: 'block' }}>
        Go to Home
      </a>
    </div>
  );
}

