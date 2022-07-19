

export default function Button(props: any) {
  // console.log(props.onClick());
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      className={`${props.className ? props.className : ''} btn`}>
      {props.children}
    </button>
  );
}