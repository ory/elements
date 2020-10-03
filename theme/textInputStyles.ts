export interface TextInputStyles {}

export const textInputStyles = () => `
color: black;

&:hover,
&:fake-hover {
  color: yellow;
}

&:focus,
&.fake-focus {
  color: blue;
}

&:disabled {
  color: grey;
}

&.state-error {
  color: red;
}

&.state-success {
  color: green;
}
`;
