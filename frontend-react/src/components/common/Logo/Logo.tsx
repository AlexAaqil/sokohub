import { Link } from 'react-router-dom';
import { config } from '../../../config';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = '' }: LogoProps) => {
  if (!config.logo.useSplit) {
    // Single name styling
    return (
      <Link to="/" className={`font-serif text-xl ${className}`}>
        {config.appName}
      </Link>
    );
  }

  // Split styling: first part normal, second part italic
  return (
    <Link to="/" className={`font-serif text-xl ${className}`}>
      {config.logo.first}
      <span className="text-gray-500 italic">{config.logo.second}</span>
    </Link>
  );
};