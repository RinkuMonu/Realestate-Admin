import UserDetailsClient from './UserDetailsClient';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function UserDetailsWrapper({ params }) {
  return <UserDetailsClient params={params} />;
}
