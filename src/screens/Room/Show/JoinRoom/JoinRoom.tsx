import React, { useState } from 'react';

import Button from '../../../../components/Button';
import Select from '../../../../components/Select';
import Input from '../../../../components/Input';

import {
  Room,
  Role,
  User,
  useCreateUserMutation,
} from '../../../../generated/graphql';

const STORAGE_KEY = '_user_' as const;
type StorageState = Pick<User, 'name' | 'role'>;

const ROLES: Array<{ label: string; value: Role }> = [
  { label: 'Participant', value: Role.Participant },
  { label: 'Observer', value: Role.Observer },
];

type Props = {
  room: Room;
  onLogin: ({ user }: { user: User }) => void;
};

const getStateFromStorage = (): StorageState => {
  const state = localStorage.getItem(STORAGE_KEY);
  if (state) {
    return JSON.parse(state) as StorageState;
  }

  return { name: '', role: ROLES[0].value };
};

const JoinRoom: React.FC<Props> = ({ onLogin }) => {
  const storageState = getStateFromStorage();
  const [name, setName] = useState(storageState.name);
  const [role, setRole] = useState(storageState.role);
  const disabled = name.length === 0;
  const [createUser, { loading }] = useCreateUserMutation();

  const usernameError =
    name.length === 0 ? `Please fill out this field.` : undefined;

  const handleSubmit = () => {
    if (disabled) return;

    createUser({ variables: { createUserInput: { role, userName: name } } })
      .then((response) => {
        if (response.errors && response.errors.length > 0) {
          // TODO: better error handling
          throw response.errors; // let error boundary take care of it
        }

        if (!response.data) throw new Error('No data');

        const user = response.data.createUser;
        onLogin({ user });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      })
      .catch((err) => {
        throw err; // Let error boundary take care of it
      });
  };

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-lg">
        <div className="flex flex-col md:flex-row">
          <div className="w-full mr-0 md:mr-2 md:w-1/2 md:mb-0">
            <Input
              id="username"
              value={name}
              onChange={setName}
              error={usernameError}
            />
          </div>

          <div className="w-full ml-0 md:ml-2 md:w-1/2">
            <Select
              id="role"
              value={role}
              onChange={(role) => setRole(role as Role)}
              options={ROLES}
            />
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center justify-end">
          <Button
            type="submit"
            disabled={disabled}
            onClick={handleSubmit}
            loading={loading}
          >
            Join
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JoinRoom;
