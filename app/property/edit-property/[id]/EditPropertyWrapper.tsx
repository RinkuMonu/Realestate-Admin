import EditPropertyClient from './EditPropertyClient';

export async function generateStaticParams() {
  return [
    { id: '101' },
    { id: '102' },
    { id: '103' },
  ];
}

export default function EditPropertyWrapper({ params }) {
  return <EditPropertyClient params={params} />;
}
