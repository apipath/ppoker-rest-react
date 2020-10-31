import React, { useState } from 'react';
import { RouteComponentProps, useParams } from 'react-router-dom';

import JoinRoom from './JoinRoom';
import VoteRoom from './VoteRoom';
import { useGetRoomQuery, User } from '../../../generated/graphql';

type Props = RouteComponentProps<{ id: string }>;

const RoomShow: React.FC<Props> = ({ location }) => {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error } = useGetRoomQuery({ variables: { id } });

  const [user, setUser] = useState<User | null>(null);
  const handleLogin = ({ user }: { user: User }) => {
    setUser(user);
  };

  if (error) {
    throw error; // will be catched by error boundary
  }
  // TODO: use a proper loading
  if (loading || !data) return <p>Loading...</p>;
  const { room } = data;

  if (!room) {
    return <div>Create that room</div>;
  }

  return (
    <section className="p-4 lg:p-5">
      <header className="p-4 grid grid-cols-3">
        <h1 className="flex items-center justify-center text-2xl font-medium col-start-2">
          <span className="text-gray-800">{room.name}</span>
          <span className="text-gray-700">#{room.id}</span>
        </h1>
      </header>
      <div>
        {user ? (
          <VoteRoom user={user} room={room} />
        ) : (
          <JoinRoom room={room} onLogin={handleLogin} />
        )}
      </div>
    </section>
  );
};

export default RoomShow;
