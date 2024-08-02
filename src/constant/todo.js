// 紧急程度
export const URGENT_IMPORTANT = "1";  // 紧急 重要
export const URGENT_NOT_IMPORTANT = "2"; // 紧急 不重要
export const NOT_URGENT_IMPORTANT = "3"; // 不紧急 重要
export const NOT_URGENT_NOT_IMPORTANT = "4"; // 不紧急 不重要

// 紧急程度
export const URGENT_IMPORTANT_COLOR = "#E47470";  // 紧急 重要
export const URGENT_NOT_IMPORTANT_COLOR = "#DCA550"; // 紧急 不重要
export const NOT_URGENT_IMPORTANT_COLOR = "#7EC050"; // 不紧急 重要
export const NOT_URGENT_NOT_IMPORTANT_COLOR = "#5A9CF8"; // 不紧急 不重要

// 对象，用程度当key，用颜色当value
export const URGENT_COLOR_MAP = {
  [URGENT_IMPORTANT]: URGENT_IMPORTANT_COLOR,
  [URGENT_NOT_IMPORTANT]: URGENT_NOT_IMPORTANT_COLOR,
  [NOT_URGENT_IMPORTANT]: NOT_URGENT_IMPORTANT_COLOR,
  [NOT_URGENT_NOT_IMPORTANT]: NOT_URGENT_NOT_IMPORTANT_COLOR,
}
export const URGENT_LABEL_MAP = {
  [URGENT_IMPORTANT]: '紧急 重要',
  [URGENT_NOT_IMPORTANT]: '紧急 不重要',
  [NOT_URGENT_IMPORTANT]: '不紧急 重要',
  [NOT_URGENT_NOT_IMPORTANT]: '不紧急 不重要',
};