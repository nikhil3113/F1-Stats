import { atom } from "recoil";

export const seasonState = atom({
    key: "seasonState",
    default: []
})

export const dateState = atom({
    key:"dateState",
    default: 2024
})

export const loadingState = atom({
    key: "loadingState",
    default: true
})

