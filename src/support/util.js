export function isEmpty(value) {
  if (value === null) return true;
  if (typeof value === 'undefined') return true;
  if (typeof value === 'string' && value === '') return true;
  if (Array.isArray(value) && value.length < 1) return true;
  if (
    typeof value === 'object' &&
    value.constructor.name === 'Object' &&
    Object.keys(value).length < 1 &&
    Object.getOwnPropertyNames(value) < 1
  ) {
    return true;
  }
  if (typeof value === 'object' && value.constructor.name === 'String' && Object.keys(value).length < 1) {
    return true;
  }
  return false;
}

/**
 * @description : value로 들어온값이 empty인지 체크해서 true이면 defaultValue를 리턴
 */
export function nvl(value, defaultValue) {
  return isEmpty(value) ? defaultValue : value;
}

/**
 *  이미지 로딩 비동기 처리
 *
 */
export const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image from ${src}`));
    image.src = src;
  });
};

export const loadImages = (deviceTypeSvg) => {
  return new Promise(async (resolve, reject) => {
    const deviceTypeImg = {};

    try {
      const promises = Object.entries(deviceTypeSvg).map(async ([key, value]) => {
        const image = await loadImage(value);
        deviceTypeImg[key] = image;
      });

      await Promise.all(promises);

      resolve(deviceTypeImg);
    } catch (error) {
      reject(error);
    }
  });
};
