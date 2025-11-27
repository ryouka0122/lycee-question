import { LOCAL_STORAGE_KEY } from "@/constants";

import { UserClient } from "@/clients/api/UserClient";
import { AppConfig } from "@/config/env";
import type { Err, Result, UserId } from "./types/common.ts";
import type { PublishIdResult } from "./clients/api/UserClient.ts";

function getRealDate(): Date {
  return new Date();
}

function getFixedDate(fixedDate: string): () => Date {
  return () => new Date(fixedDate);
}

const _getCurrentDate = AppConfig.fixedDate
  ? getFixedDate(AppConfig.fixedDate)
  : getRealDate;

export function getCurrentDate(): Date {
  return _getCurrentDate();
}

export function parseDate(n: unknown) {
  let date!: Date;
  if (typeof n === "string") {
    date = new Date(n);
  } else if (n instanceof Date) {
    date = n;
  } else {
    return undefined;
  }
  return isNaN(date.getTime()) ? undefined : date;
}

export function showErrorMessage(e: Err) {
  alert(`${e.message}\n(エラーコード：${e.errorCode})`);
}

export async function getUserId(): Promise<UserId> {
  const userId = localStorage.getItem(LOCAL_STORAGE_KEY.USER_ID);
  if (userId && userId !== "undefined") {
    return userId as UserId;
  }

  const client = new UserClient();
  const result: Result<PublishIdResult> = await client.publishId();

  if (!result.ok) {
    alert("APIエラーが発生しました．");
    throw new Error("APIエラー");
  }
  localStorage.setItem(LOCAL_STORAGE_KEY.USER_ID, result.data.userId);
  return result.data.userId;
}

export function formatDate(
  date: Date,
  format: string = "YYYY-MM-DDThh:mm:ss",
): string {
  // 日付フォーマットのパターン
  const pad2 = (n: number) => ("00" + n).slice(-2);
  const mapper: Record<string, (d: Date) => string> = {
    YYYY: (d: Date): string => "" + d.getFullYear(),
    MM: (d: Date) => pad2(d.getMonth() + 1),
    DD: (d: Date) => pad2(d.getDate()),
    hh: (d: Date) => pad2(d.getHours()),
    mm: (d: Date) => pad2(d.getMinutes()),
    ss: (d: Date) => pad2(d.getSeconds()),
  };

  // パターンが長い順に並び替えておく
  const keys = Object.keys(mapper).sort((a, b) => {
    return b.length - a.length;
  }) as string[];

  // フォーマットの適用
  let result = format;
  for (const key of keys) {
    if (key in mapper) {
      result = result.replaceAll(key, mapper[key]!(date));
    }
  }

  return result;
}
