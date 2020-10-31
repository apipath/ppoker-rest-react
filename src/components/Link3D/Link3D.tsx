import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import cn from 'classnames';

type Color = 'purple' | 'blue' | 'indigo';

const Link3D: React.FC<LinkProps & { color?: Color }> = ({
  color = 'purple',
  className,
  ...rest
}) => {
  return (
    <Link
      {...rest}
      className={cn(
        'px-4 py-2 font-bold text-white bg-purple-500 border-b-4 border-purple-700 rounded hover:bg-purple-400 hover:border-purple-500'.replaceAll(
          'purple',
          color,
        ),
        className,
      )}
    />
  );
};

export default Link3D;
