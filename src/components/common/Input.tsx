import React from 'react';
export default function Input({
  type,
  value,
}: {
  type: string;
  value: string;
}): React.ReactElement {
  return <input type={type} value={value} />;
}
