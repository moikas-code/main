import React from 'react';
import Button from '../common/Button';
export default function NavButton({
  children,
  className,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}): React.ReactElement {
  console.log('navbar', className);
  return (
    <>
      <style jsx>
        {`
          .nav-btn {
            min-height: 25px;
            width: 150px;
            font-size: 0.95rem;
            padding: 0 0.5rem;
            margin: 0 0.5rem;
            border-bottom: 1px solid #000;
          }
          .nav-btn:hover {
            border-bottom: 1px solid blue;
          }
        `}
      </style>
      <div
        className={
          `d-flex flex-row justify-content-center cursor-pointer nav-btn ` +
          className
        }
        onClick={onClick}>
        {children}
      </div>
    </>
  );
}
