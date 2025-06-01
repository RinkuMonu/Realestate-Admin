import EditBlogClient from './EditBlogClient';

// ✅ Replace with real IDs or fetch from your backend
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function EditBlogWrapper({ params }) {
  return <EditBlogClient params={params} />;
}
