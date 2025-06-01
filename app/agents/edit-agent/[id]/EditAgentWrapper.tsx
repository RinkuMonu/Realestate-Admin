import EditAgentClient from './EditAgentClient';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function EditAgentWrapper({ params }) {
  return <EditAgentClient params={params} />;
}
