import {
    URGENT_IMPORTANT,
    URGENT_NOT_IMPORTANT,
    NOT_URGENT_IMPORTANT,
    NOT_URGENT_NOT_IMPORTANT,
    URGENT_IMPORTANT_COLOR,
    URGENT_NOT_IMPORTANT_COLOR,
    NOT_URGENT_IMPORTANT_COLOR,
    NOT_URGENT_NOT_IMPORTANT_COLOR,
  } from "@/constant/todo";
  
  export const priorityOptions = [
    {
      value: URGENT_IMPORTANT,
      label1: "紧急",
      label2: "重要",
      color: URGENT_IMPORTANT_COLOR,
    },
    {
      value: URGENT_NOT_IMPORTANT,
      label1: "紧急",
      label2: "不重要",
      color: URGENT_NOT_IMPORTANT_COLOR,
    },
    {
      value: NOT_URGENT_IMPORTANT,
      label1: "不紧急",
      label2: "重要",
      color: NOT_URGENT_IMPORTANT_COLOR,
    },
    {
      value: NOT_URGENT_NOT_IMPORTANT,
      label1: "不紧急",
      label2: "不重要",
      color: NOT_URGENT_NOT_IMPORTANT_COLOR,
    },
  ];
  