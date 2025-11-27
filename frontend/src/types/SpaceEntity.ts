import type { SpaceId, UserId } from "./common.ts";
import type { SpaceInfo } from "./api.ts";

export class SpaceEntity {
  // スペースID
  id: SpaceId;
  // 開設ユーザID
  ownerId: UserId;
  // スペース名
  name: string;
  // 開設日時
  openedDate: Date;
  // 終了日時
  closeDate: Date;
  // スペース画像（予約）
  img?: string;
  // 概要（予約）
  description?: string;

  constructor(
    id: SpaceId,
    ownerId: UserId,
    name: string,
    openedDate: Date,
    closeDate: Date,
    roomImg?: string | undefined,
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.name = name;
    this.openedDate = openedDate;
    this.closeDate = closeDate;
    this.img = roomImg;
  }

  static from({ id, ownerId, name, openedTime, closeTime }: SpaceInfo) {
    return new SpaceEntity(
      id,
      ownerId,
      name,
      new Date(openedTime),
      new Date(closeTime),
    );
  }
}
