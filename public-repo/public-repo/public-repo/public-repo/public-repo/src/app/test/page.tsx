export default function TestPage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Test Page Working!</h1>
      <p>If you can see this, the deployment is working.</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
}