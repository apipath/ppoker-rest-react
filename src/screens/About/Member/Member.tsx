import React from 'react';

type Props = {
  name: string;
  login: string;
  location?: string | null;
  htmlUrl: string;
};

const AboutMember: React.FC<Props> = ({ name, login, location, htmlUrl }) => {
  return (
    <div className="flex flex-col items-center justify-center px-2 py-6 leading-normal sm:w-64">
      <img
        loading="eager"
        className="w-40 h-40 rounded-full"
        src={`https://github.com/${login}.png`}
        alt={`${name} Avatar`}
      />
      <h3 className="my-2 text-lg font-semibold leading-none">{name}</h3>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={htmlUrl}
        className="text-blue-600 hover:text-blue-500"
      >
        @{login}
      </a>
      <address className="text-sm text-gray-600">{location}</address>
    </div>
  );
};

export default AboutMember;
