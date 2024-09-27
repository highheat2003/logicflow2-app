import IconNode from './IconNode';

// 왼쪽 상단 아이콘은 메시지의 노드입니다.
class MessageNode extends IconNode.view {
  getImageHref() {
    return 'https://dpubstatic.udache.com/static/dpubimg/1TZgBoaq8G/message.png';
  }
}

export default {
  type: 'icon-message',
  view: MessageNode,
  model: IconNode.model,
};
