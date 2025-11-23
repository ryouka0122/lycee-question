
import {
  LOCAL_STORAGE_KEY
} from '@/constants'

import { UserClient } from '@/clients/api/UserClient'
import {AppConfig} from "@/config/env";

function getRealDate() {
  return new Date()
}

function getFixedDate(fixedDate) {
  return () => Date.parse(fixedDate)
}

const _getCurrentDate = (AppConfig.fixedDate)
  ? getFixedDate(AppConfig.fixedDate) : getRealDate

export function getCurrentDate() {
  return _getCurrentDate()
}

export async function getUserId() {

  const userId = localStorage.getItem(LOCAL_STORAGE_KEY.USER_ID)
  if (userId && userId !=='undefined') {
    return userId
  }

  const client = new UserClient()
  const response = await client.publishId().then(result => {
    return result.data
  })

  localStorage.setItem(LOCAL_STORAGE_KEY.USER_ID, response.userId)
  return response.userId
}

/**
 *
 * @param date {Date}
 * @param format {string}
 */
export function formatDate(date, format = 'YYYY-MM-DDThh:mm:ss') {
  // 日付フォーマットのパターン
  const pad2 = (n) => ("00" + n).slice(-2)
  const mapper = {
    "YYYY": (date) => date.getFullYear(),
    "MM": (date) => pad2(date.getMonth() + 1),
    "DD": (date) => pad2(date.getDate()),
    "hh": (date) => pad2(date.getHours()),
    "mm": (date) => pad2(date.getMinutes()),
    "ss": (date) => pad2(date.getSeconds()),
  }

  // パターンが長い順に並び替えておく
  const keys = Object.keys(mapper).sort((a, b) => {
    return b.length - a.length
  })

  // フォーマットの適用
  let result = format;
  for(const key of keys) {
    result = result.replaceAll(key, mapper[key](date));
  }

  return result;
}
