import React from 'react';
export default function H({
  headerSize = '1',
  children,
  className,
}: {
  headerSize: '1' | '2' | '3' | '4' | '5' | '6';
  children?: React.ReactNode;
  className?: string;
}): React.ReactElement {
  {
    switch (headerSize) {
      case '2':
        return (
          <h2
            className={`${typeof className !== 'undefined' ? className : ''}`}>
            {children}
          </h2>
        );
      case '3':
        return (
          <h3
            className={`${typeof className !== 'undefined' ? className : ''}`}>
            {children}
          </h3>
        );
      case '4':
        return (
          <h4
            className={`${typeof className !== 'undefined' ? className : ''}`}>
            {children}
          </h4>
        );
      case '5':
        return (
          <h5
            className={`${typeof className !== 'undefined' ? className : ''}`}>
            {children}
          </h5>
        );
      case '6':
        return (
          <h6
            className={`${typeof className !== 'undefined' ? className : ''}`}>
            {children}
          </h6>
        );
      case '1':
      default:
        return (
          <h1
            className={`${typeof className !== 'undefined' ? className : ''}`}>
            {children}
          </h1>
        );
    }
  }
}
