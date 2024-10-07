import { createApp, h } from 'vue';
import Connect from './Connect.vue';

export default function registerConnect(lf) {
  lf.register('connect', ({ HtmlNode, HtmlNodeModel }) => {
    class ConnectNode extends HtmlNode {
      setHtml(rootEl) {
        const { properties } = this.props.model;
        const el = document.createElement('div');
        rootEl.innerHTML = '';
        rootEl.appendChild(el);
        // Vue 3에서는 createApp을 사용
        const app = createApp({
          render() {
            return h(Connect, {
              name: properties.name, // Vue 3에서 props는 직접 전달
              onSelectButton: (type) => {
                console.log('select-button', type);
              },
            });
          },
        });

        app.mount(el); // Vue 3에서는 $mount 대신 mount를 사용
      }
    }
    class ConnectNodeModel extends HtmlNodeModel {
      initNodeData(data) {
        if (data.text) {
          data.text.editable = false;
        }
        super.initNodeData(data);
        const width = 300;
        const height = 220;
        this.width = width;
        this.height = height;
        this.anchorsOffset = [
          [width / 2, 0],
          [0, height / 2],
          [-width / 2, 0],
          [0, -height / 2],
        ];
      }
    }
    return {
      view: ConnectNode,
      model: ConnectNodeModel,
    };
  });
}
