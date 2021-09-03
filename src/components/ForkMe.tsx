import React from 'react';
import styled from 'styled-components';
import {
  forkMeStyles,
  forkMeStylesFork,
  forkMeStylesImages,
  forkMeStylesLink,
  forkMeStylesText
} from '../theme';

export interface ForkMeProps extends React.HTMLAttributes<HTMLDivElement> {}

const Text = styled.div(forkMeStylesText);
const Image = styled.img(forkMeStylesImages);
const Fork = styled.img(forkMeStylesFork);
const Link = styled.a(forkMeStylesLink);

const ForkMe = ({ className }: ForkMeProps) => (
  <div className={className}>
    {/*<Image src={require('../stories/assets/ory.png')} />*/}
    <Text>
      Fork this example project on{' '}
      <Link href={'https://github.com/ory'}>
        {/*<Fork src={require('../stories/assets/repo-forked.png')} />*/}
        GitHub!
      </Link>
    </Text>
  </div>
);

export default styled(ForkMe)(forkMeStyles);
