import { authConfig } from '@/config/auth';
import { getServerSession } from 'next-auth/next';

export default async function About() {
  const session = await getServerSession(authConfig);

  return (
    <div className='container'>
      <h1 className="profile-title">User Profile Page</h1>
      {session?.user?.image && <img src={session.user.image} width={100} height={100} alt="User avatar" />}
      {session?.user?.name && <p>Name: {session.user.name}</p>}
      {session?.user?.email && <p>Email: {session.user.email}</p>}
    </div>
  );
}
