/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
import { EffectCallback, useEffect } from "react";

export default (effect: EffectCallback) => useEffect(effect, []);
