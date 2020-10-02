import { Theme } from './index';

export interface TextInputStyles {}

export const textInputStyles = ({ theme }: { theme: Theme }) => `
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
