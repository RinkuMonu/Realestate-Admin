import AgentDetailClient from './AgentDetailClient';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function AgentDetailWrapper({ params }) {
  return <AgentDetailClient params={params} />;
}
