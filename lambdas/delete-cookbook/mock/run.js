import index from './../index-delete-cookbook';
import event from './event.json';

index.handler(event, {}, (e, m) => {
  if (e) {
    console.log('ERROR', e);
    return;
  }

  console.log(m);
});
