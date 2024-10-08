import ImageNode from './ImageNode';

// 사진-노드 설정
class SettingModel extends ImageNode.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 60;
    this.height = 60;
  }
}
class SettingNode extends ImageNode.view {
  getImageHref() {
    return 'https://dpubstatic.udache.com/static/dpubimg/UzI4AFUcfO/setting.png';
  }
}

export default {
  type: 'image-setting',
  view: SettingNode,
  model: SettingModel,
};
