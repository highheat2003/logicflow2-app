// 기본 그래픽
import CircleNode from './basic/CircleNode';
import RectNode from './basic/RectNode';
import RectRadiusNode from './basic/RectRadiusNode';
import EllipseNode from './basic/EllipseNode';
import TextNode from './basic/TextNode';
import DiamondNode from './basic/DiamondNode';
// path별로 그려지는 맞춤형 그래픽
import CylindeNode from './path/CylindeNode';
import TriangleNode from './path/TriangleNode';
import ParallelogramNode from './path/ParallelogramNode';
import ActorNode from './path/ActorNode';
import StarNode from './path/Star';
import PentagonNode from './path/PentagonNode';
import HexagonNode from './path/HexagonNode';
import SeptagonNode from './path/SeptagonNode';
import HeptagonNode from './path/HeptagonNode';
import TrapezoidNode from './path/TrapezoidNode';
import CrossNode from './path/CrossNode';
import MinusNode from './path/MinusNode';
import TimesNode from './path/TimesNode';
import DivideNode from './path/DivideNode';
// 다각형으로 그려진 화살표
import LeftArrow from './arrow/LeftArrow';
import RightArrow from './arrow/RightArrow';
import HorizontalArrow from './arrow/HorizontalArrowNode';
import UpArrow from './arrow/UpArrowNode';
import DownArrow from './arrow/DownArrowNode';
import VerticalArrow from './arrow/VerticalArrowNode';
// 이미지가 이미지 노드를 그립니다.
import ImageSetting from './image/Setting';
import ImageUser from './image/User';
import ImageCloud from './image/Cloud';
// 이미지가 왼쪽 상단 아이콘 노드를 그립니다.
import IconMessage from './icon/Message';
// 등록 측면
import Ployline from './edge/Polyline';
import Line from './edge/Line';
import Bezier from './edge/Bezier';

export const registerCustomElement = (lf) => {
  // 기본 그래픽 등록
  lf.register(CircleNode);
  lf.register(RectNode);
  lf.register(RectRadiusNode);
  lf.register(EllipseNode);
  lf.register(DiamondNode);
  lf.register(TextNode);
  // 경로별로 그려진 개인화된 그래픽 등록
  lf.register(CylindeNode);
  lf.register(TriangleNode);
  lf.register(ParallelogramNode);
  lf.register(ActorNode);
  lf.register(StarNode);
  lf.register(PentagonNode);
  lf.register(HexagonNode);
  lf.register(SeptagonNode);
  lf.register(HeptagonNode);
  lf.register(TrapezoidNode);
  lf.register(CrossNode);
  lf.register(MinusNode);
  lf.register(TimesNode);
  lf.register(DivideNode);
  // 등록된 다각형으로 그려진 화살표
  lf.register(LeftArrow);
  lf.register(RightArrow);
  lf.register(HorizontalArrow);
  lf.register(UpArrow);
  lf.register(DownArrow);
  lf.register(VerticalArrow);
  // 이미지 노드를 그릴 이미지 등록
  lf.register(ImageSetting);
  lf.register(ImageUser);
  lf.register(ImageCloud);
  // 이미지를 등록하여 왼쪽 상단 아이콘 노드를 그립니다.
  lf.register(IconMessage);
  // 등록 측면
  lf.register(Ployline);
  lf.register(Line);
  lf.register(Bezier);
};
