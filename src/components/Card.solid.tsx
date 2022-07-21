import {customElement} from 'solid-element';
import {card, CardVariants} from '../theme';

type CardProps = {
  title: string;
  description: string;
  size?: 'wide' | 'medium' | 'narrow';
} & CardVariants

customElement('card', {title: '', description: ''}, (props: CardProps, {element}) => {
  return (
    <div class={card({size: props.size})}>
      <div>
        {props.title}
      </div>
    </div>
  );
})
