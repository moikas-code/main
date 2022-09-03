import React from 'react';
import styled from 'styled-components';
export default function StatBlock({
  label,
}: {
  label: string;
}): React.ReactElement {
  const Div = styled.div`
    & {
      display: flex;
      padding: 0.5rem;
      flex-direction: column;
      border-radius: 5px;
      width: 200px;
      height: 200px;
      cursor: pointer;
      border: 3px solid #000;
      background-color: #fff;
      box-shadow: 10px -10px 0 -3px #fff, 10px -10px, 20px -20px 0 -3px #fff,
        20px -20px;
      transition: box-shadow 1s, top 1s, left 1s;
      top: 0;
      left: 0;
    }
    &:hover {
      top: -20px;
      left: 20px;
      box-shadow: 0 0 0 -3px #fff, 0 0, 0 0 0 -3px #fff, 0 0;
    }
  `;
  return (
    <Div>
      <div>{}</div>
      <div>{label}</div>
    </Div>
  );
}
