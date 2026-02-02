import { ObjectId } from "bson";

const isObjectIdString = (value) => typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value);

export const toObjectId = (value) => {
  if (value instanceof ObjectId) return value;
  if (isObjectIdString(value)) return new ObjectId(value);
  if (value && typeof value === "object" && value.$oid) return new ObjectId(value.$oid);
  return value;
};

export const normalizeIds = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeIds(item));
  }

  if (value && typeof value === "object") {
    const normalized = {};
    for (const [key, val] of Object.entries(value)) {
      if (key === "_id") {
        normalized[key] = toObjectId(val);
        continue;
      }

      if (Array.isArray(val)) {
        normalized[key] = normalizeIds(val);
        continue;
      }

      if (val && typeof val === "object" && val.$oid) {
        normalized[key] = toObjectId(val);
        continue;
      }

      if (/(Id|Ids)$/.test(key) && (isObjectIdString(val) || (val && typeof val === "object" && val.$oid))) {
        normalized[key] = toObjectId(val);
        continue;
      }

      if (Array.isArray(val) && /(Ids)$/.test(key)) {
        normalized[key] = val.map((item) => toObjectId(item));
        continue;
      }

      normalized[key] = normalizeIds(val);
    }
    return normalized;
  }

  return value;
};
