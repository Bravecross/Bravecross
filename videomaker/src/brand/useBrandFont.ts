import {continueRender, delayRender, staticFile} from "remotion";
import {useEffect, useState} from "react";
import type {BrandTokens} from "./tokens";

const loaded = new Set<string>();

export const useBrandFont = (brand: BrandTokens) => {
  const [ready, setReady] = useState(() =>
    loaded.has(brand.typography.fontFamily),
  );

  useEffect(() => {
    if (loaded.has(brand.typography.fontFamily)) {
      setReady(true);
      return;
    }

    const handle = delayRender(`Loading font ${brand.typography.fontFamily}`);
    const face = new FontFace(
      brand.typography.fontFamily,
      `url(${staticFile(brand.typography.fontFile)})`,
      {weight: "100 900", style: "normal"},
    );

    face
      .load()
      .then(() => {
        document.fonts.add(face);
        loaded.add(brand.typography.fontFamily);
        setReady(true);
        continueRender(handle);
      })
      .catch((err) => {
        console.error(err);
        setReady(true);
        continueRender(handle);
      });
  }, [brand.typography.fontFamily, brand.typography.fontFile]);

  return ready;
};
