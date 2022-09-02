export default function Button({disabled=false, children, className, onClick}: any) {
  return (
    <>
      <style jsx>
        {`
          .btn {
            min-width: 100px;
            min-height: 40px;
          }
        `}
      </style>
      <button
        disabled={disabled}
        onClick={onClick}
        className={`btn ${typeof className !== 'undefined' ? className : ''}`}>
        {children}
      </button>
    </>
  );
}
