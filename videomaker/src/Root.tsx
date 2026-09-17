import "./index.css";
import React from "react";
import {Composition, Folder} from "remotion";
import {ProductDemoMotion} from "./compositions/ProductDemoMotion";
import {
  PRODUCT_DEMO_DURATION_FRAMES,
  PRODUCT_DEMO_FPS,
  PRODUCT_DEMO_HEIGHT,
  PRODUCT_DEMO_WIDTH,
  defaultProductDemoProps,
  type ProductDemoProps,
} from "./props/productDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="BraveCross-VideoMaker">
      <Composition
        id="ProductDemoMotion"
        component={ProductDemoMotion}
        durationInFrames={PRODUCT_DEMO_DURATION_FRAMES}
        fps={PRODUCT_DEMO_FPS}
        width={PRODUCT_DEMO_WIDTH}
        height={PRODUCT_DEMO_HEIGHT}
        defaultProps={defaultProductDemoProps}
        calculateMetadata={({props}: {props: ProductDemoProps}) => ({
          props,
          durationInFrames: PRODUCT_DEMO_DURATION_FRAMES,
        })}
      />
    </Folder>
  );
};
