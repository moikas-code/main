
export default function NavButton(props: any) {
  function handleRoute(path) {
    if (
      typeof window !== 'undefined' &&
       document.getElementById(path) !== null
    ) {
      document.getElementById(path).scrollIntoView({
        behavior: 'smooth',
      });
    }
    return;
  }
  return (
    <button
      disabled={props.disabled}
      className={`${props.className ? props.className : ''} btn`}
      onClick={() => {
        handleRoute(props.path);
      }}>
      {props.children}
    </button>
  );
}
