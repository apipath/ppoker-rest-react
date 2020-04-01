import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useTypedSelector } from '../../../store';
import JoinRoom from './JoinRoom';
import VoteRoom from './VoteRoom';
import { Observer, Session, Participant } from '../../../types';
import { useDispatch } from 'react-redux';
import { joinRoom } from '../../../store/room/actions';
import { useGetRoomQuery, Room } from '../../../generated/graphql';
import { NOT_FOUND_ERR_CODE, hasError } from '../../../errors';

function RoomShow() {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error } = useGetRoomQuery({ variables: { id } });

  const [showVotes] = useState(false);
  const session = useTypedSelector((state) => state.session);
  const dispatch = useDispatch();

  const handleLogin = ({
    session,
    participants,
    observers,
    room,
  }: {
    session: Session;
    participants: Array<Participant>;
    observers: Array<Observer>;
    room: Room;
  }) => {
    dispatch(joinRoom({ session, room, observers, participants }));
  };

  if (error) {
    if (hasError(error, NOT_FOUND_ERR_CODE)) {
      return <p>NOT FOUND</p>;
    }

    throw error;
  }
  // TODO: use a proper loading
  if (loading || !data) return <p>Loading...</p>;
  const { room } = data;

  if (!room) {
    return <div>Create that room</div>;
  }

  return (
    <section className="p-4 lg:p-5">
      <h1 className="mb-8 text-2xl font-medium text-center">
        <span className="text-gray-800">{room.name}</span>
        <span className="text-gray-700">#{room.id}</span>
      </h1>
      <div>
        {session ? (
          <VoteRoom room={room} showVotes={showVotes} />
        ) : (
          <JoinRoom room={room} onLogin={handleLogin} />
        )}
      </div>
    </section>
  );
}

export default RoomShow;
