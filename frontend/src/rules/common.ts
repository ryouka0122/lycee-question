import { getCurrentDate } from "../utils.ts";
import { SPACE_OPEN_MINIMUM_SPAN } from "../constants.ts";

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
        return message ?? `${length}文字以上で入力してください`;
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
        return message ?? `${length}文字以下で入力してください`;
      }
      return true;
    };
  },
};

function parseDate(value?: Date | string) {
  if (typeof value === "string") {
    return new Date(value);
  }
  return value;
}

type DateCompValidationOptions = {
  // 基準日からの禁止日数
  span?: number;

  // 基準日（未入力時は表示時の時刻）
  date?: Date | string;

  // エラー時のメッセージ
  message?: string;

  // 当日有効フラグ
  equal?: boolean;
};

export const dates = {
  /**
   * 過去日判定
   * @param span
   * @param date
   * @param message
   * @param equal
   */
  before({
    span = 0,
    date,
    message,
    equal = false,
  }: DateCompValidationOptions) {
    const base = parseDate(date) ?? getCurrentDate();

    // 禁止日時分の補正
    let baseMessage = "過去日を入力してください";
    if (span > 0) {
      base.setDate(base.getDate() - span);
      baseMessage = `${span}日以前の過去日を入力してください`;
    }

    return (value: unknown) => {
      if (value instanceof Date) {
        if (value > base) {
          return message ?? baseMessage;
        }
      }
      return true;
    };
  },
  /**
   * 未来日判定
   * @param span
   * @param date
   * @param message
   * @param equal
   */
  after({ span = 0, date, message, equal = false }: DateCompValidationOptions) {
    const base = parseDate(date) ?? getCurrentDate();

    // 禁止日時分の補正
    let baseMessage = "未来日を入力してください";
    if (span > 0) {
      base.setDate(base.getDate() + span);
      baseMessage = `${span}日以降の未来日を入力してください`;
    }

    return (value: unknown) => {
      if (value instanceof Date) {
        if (value < base) {
          return message ?? baseMessage;
        }
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
  closeDateRules() {
    return [
      common.required(),
      dates.after({ span: SPACE_OPEN_MINIMUM_SPAN - 1 }),
    ];
  },
};

/**
 * 質問関係のルール
 */
export const question = {
  descriptionRule() {
    return [common.required(), common.maxLength(1000)];
  },
};
