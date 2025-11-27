/**
 * 共通ルール
 */
export const common = {
  /**
   * 必須項目チェック
   * @param message
   */
  required(message?: string) {
    return (value: unknown) => {
      if (value === null || value === undefined || value === "") {
        return message ?? "必須項目です";
      }
      return true;
    };
  },
  /**
   * 最小文字数チェック
   * @param length
   * @param message
   */
  minLength(length: number, message?: string) {
    return (value: unknown) => {
      if (typeof value === "string" && value.length < length) {
        return message ?? `${length}文字以上で入力してください．`;
      }
      return true;
    };
  },
  /**
   * 最大文字数チェック
   * @param length
   * @param message
   */
  maxLength(length: number, message?: string) {
    return (value: unknown) => {
      if (typeof value === "string" && value.length > length) {
        return message ?? `${length}文字以下で入力してください．`;
      }
      return true;
    };
  },
};

/**
 * スペース関係のルール
 */
export const space = {
  nameRules() {
    return [common.required(), common.minLength(3)];
  },
};
