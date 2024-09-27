const data = {
  nodes: [
    {
      id: '1',
      type: 'rect',
      x: 100,
      y: 100,
      text: '노드1',
      properties: {
        style: {
          stroke: '#200FD9',
        },        
      },
    },
    {
      id: '2',
      type: 'circle',
      x: 300,
      y: 100,
      text: '노드2',
    },
  ],
  edges: [
    {
      sourceNodeId: '1',
      targetNodeId: '2',
      type: 'polyline',
      text: '연결',
      startPoint: {
        x: 140,
        y: 100,
      },
      endPoint: {
        x: 250,
        y: 100,
      },
    },
  ],
};

const styleConfig = {
  style: {
    rect: {
      rx: 5,
      ry: 5,
      strokeWidth: 2,
    },
    circle: {
      fill: '#f5f5f5',
      stroke: '#666',
    },
  },
};

const SilentConfig = {
  isSilentMode: true,
  stopScrollGraph: true,
  stopMoveGraph: true,
  stopZoomGraph: true,
  adjustNodePosition: true,
};

export { data, SilentConfig, styleConfig };