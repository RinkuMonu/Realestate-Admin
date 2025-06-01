import EditUserClient from './EditUserClient';

// ✅ Replace with real user IDs (or fetch dynamically if public)
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function EditUserWrapper({ params }) {
  return <EditUserClient params={params} />;
}
