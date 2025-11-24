import { LOCAL_STORAGE_KEY } from "@/constants";

import { UserClient } from "@/clients/api/UserClient";
import { AppConfig } from "@/config/env";
import type { UserGetResponse } from "./types/api.ts";
import type { UserId } from "./types/common.ts";

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

export async function getUserId(): Promise<UserId> {
  const userId = localStorage.getItem(LOCAL_STORAGE_KEY.USER_ID);
  if (userId && userId !== "undefined") {
    return userId as UserId;
  }

  const client = new UserClient();
  const response: UserGetResponse = await client.publishId().then((result) => {
    return result.data;
  });

  localStorage.setItem(LOCAL_STORAGE_KEY.USER_ID, response.userId);
  return response.userId;
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
