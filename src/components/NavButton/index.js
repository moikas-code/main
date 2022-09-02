
export default function NavButton({children, className, onClick}) {
  console.log('navbar', className);
  return (
    <>
      <style jsx>
        {`
          .nav-btn {
            min-height: 40px;
            min-width: 150px;
          }
        `}
      </style>
      <button
        disabled={disabled}
        onClick={onClick}
        className={'nav-btn'}>
        {children}
      </button>
    </>
  );
}
