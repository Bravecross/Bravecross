import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {useBrandFont} from "../brand/useBrandFont";
import type {ProductDemoProps} from "../props/productDemo";

const BOARD_TOP = 280;
const BOARD_SIDE = 52;
const COLUMN_GAP = 18;
const CARD_HEIGHT = 118;
const CURSOR_SIZE = 72;

type Point = {x: number; y: number};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

const DealCardView: React.FC<{
  title: string;
  value: string;
  company?: string;
  brand: ProductDemoProps["brand"];
  lifted?: boolean;
  scale?: number;
  rotate?: number;
  opacity?: number;
  width: number;
}> = ({
  title,
  value,
  company,
  brand,
  lifted = false,
  scale = 1,
  rotate = 0,
  opacity = 1,
  width,
}) => {
  return (
    <div
      style={{
        width,
        height: CARD_HEIGHT,
        borderRadius: brand.radii.card,
        background: brand.colors.surface,
        boxShadow: lifted ? brand.shadows.cardLifted : brand.shadows.card,
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        opacity,
        transformOrigin: "center center",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: brand.colors.text,
            letterSpacing: -0.3,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
        {company ? (
          <div
            style={{
              marginTop: 6,
              fontSize: 15,
              color: brand.colors.textMuted,
              fontWeight: 500,
            }}
          >
            {company}
          </div>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: brand.colors.columnHeader,
          }}
        >
          {value}
        </span>
        <span
          style={{
            width: 28,
            height: 8,
            borderRadius: brand.radii.badge,
            background: brand.colors.surfaceMuted,
          }}
        />
      </div>
    </div>
  );
};

const CursorHand: React.FC<{
  x: number;
  y: number;
  pressing: number;
  opacity: number;
  accent: string;
}> = ({x, y, pressing, opacity, accent}) => {
  const pressScale = interpolate(pressing, [0, 1], [1, 0.88]);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        opacity,
        transform: `scale(${pressScale})`,
        transformOrigin: "12px 8px",
        pointerEvents: "none",
        zIndex: 50,
        filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.28))",
      }}
    >
      <svg viewBox="0 0 72 72" width={CURSOR_SIZE} height={CURSOR_SIZE}>
        <path
          d="M22 10c0-2.2 1.8-4 4-4s4 1.8 4 4v18.2l3.1-2.4a4.2 4.2 0 0 1 5.9.6l1.2 1.5-9.8 12.1a10 10 0 0 0-2.2 6.2V56c0 2.2-1.8 4-4 4h-1.5c-8.3 0-15-6.7-15-15V28c0-2.2 1.8-4 4-4s4 1.8 4 4v-8c0-2.2 1.8-4 4-4s4 1.8 4 4V10z"
          fill="#fff"
          stroke="#1a1a1a"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <circle cx="54" cy="18" r="7" fill={accent} opacity={0.95} />
      </svg>
    </div>
  );
};

const SuccessBadge: React.FC<{
  progress: number;
  brand: ProductDemoProps["brand"];
}> = ({progress, brand}) => {
  const scale = spring({
    frame: Math.round(progress * 20),
    fps: 30,
    config: {damping: 12, stiffness: 160, mass: 0.6},
  });
  return (
    <div
      style={{
        position: "absolute",
        right: -10,
        top: -14,
        width: 44,
        height: 44,
        borderRadius: 22,
        background: brand.colors.success,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        fontWeight: 800,
        transform: `scale(${Math.max(scale * progress, 0)})`,
        boxShadow: "0 10px 24px rgba(34,160,107,0.4)",
        zIndex: 20,
      }}
    >
      ✓
    </div>
  );
};

export const ProductDemoMotion: React.FC<ProductDemoProps> = (props) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const {brand, columns, deal, staticCards, ctaLabel, headline, showAudio} =
    props;
  useBrandFont(brand);

  const boardWidth = width - BOARD_SIDE * 2;
  const columnWidth =
    (boardWidth - COLUMN_GAP * (columns.length - 1)) / columns.length;
  const cardWidth = columnWidth - 24;

  const columnX = (index: number) =>
    BOARD_SIDE + index * (columnWidth + COLUMN_GAP);
  const cardInColumnX = (index: number) => columnX(index) + 12;
  const cardYInColumn = (slot: number) =>
    BOARD_TOP + 78 + slot * (CARD_HEIGHT + 14);

  const liftStart = 130;
  const dragStart = 165;
  const dropAt = 275;
  const successAt = 288;
  const ctaAt = 318;

  const boardEnter = spring({
    frame,
    fps,
    config: {damping: 18, stiffness: 90, mass: 0.9},
  });
  const boardY = interpolate(boardEnter, [0, 1], [80, 0]);
  const boardOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });

  const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const logoY = interpolate(
    spring({
      frame,
      fps,
      config: {damping: 16, stiffness: 120},
    }),
    [0, 1],
    [-20, 0],
  );

  const fromX = cardInColumnX(deal.fromColumn);
  const fromY = cardYInColumn(0);
  const toX = cardInColumnX(deal.toColumn);
  const toY = cardYInColumn(0);

  const press = clamp01(
    interpolate(frame, [liftStart, liftStart + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  const liftSpring = spring({
    frame: Math.max(0, frame - liftStart - 8),
    fps,
    config: {damping: 14, stiffness: 140, mass: 0.55},
  });

  const isLifted = frame >= liftStart + 8 && frame < dropAt;
  const isDragging = frame >= dragStart && frame < dropAt;

  const dragT = clamp01(
    interpolate(frame, [dragStart, dropAt], [0, 1], {
      easing: Easing.bezier(0.22, 0.61, 0.36, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  const dragX = interpolate(dragT, [0, 1], [fromX, toX]);
  const dragY =
    interpolate(dragT, [0, 1], [fromY, toY]) - Math.sin(dragT * Math.PI) * 48;

  const settle = spring({
    frame: Math.max(0, frame - dropAt),
    fps,
    config: {damping: 12, stiffness: 160, mass: 0.5},
  });

  const heroX = frame < dragStart ? fromX : frame < dropAt ? dragX : toX;
  const heroY =
    frame < dragStart
      ? fromY
      : frame < dropAt
        ? dragY
        : interpolate(settle, [0, 1], [toY - 8, toY]);

  const heroScale = isLifted
    ? interpolate(liftSpring, [0, 1], [1, 1.08])
    : frame >= dropAt
      ? interpolate(settle, [0, 1], [1.08, 1])
      : 1;

  const heroRotate = isDragging
    ? interpolate(dragT, [0, 0.5, 1], [0, -7, 3])
    : frame >= dropAt
      ? interpolate(settle, [0, 1], [3, 0])
      : interpolate(liftSpring, [0, 1], [0, -4]) * (isLifted ? 1 : 0);

  const cursorAppear = clamp01(
    interpolate(frame, [88, 105], [0, 1], {extrapolateRight: "clamp"}),
  );
  const cursorExit = clamp01(
    interpolate(frame, [300, 320], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  const cursorTarget: Point =
    frame < liftStart
      ? {
          x: interpolate(frame, [88, liftStart], [width * 0.72, fromX + 70], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }),
          y: interpolate(frame, [88, liftStart], [BOARD_TOP + 420, fromY + 40], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }),
        }
      : frame < dropAt
        ? {x: heroX + 78, y: heroY + 52}
        : {
            x: interpolate(frame, [dropAt, 300], [toX + 78, toX + 110], {
              extrapolateRight: "clamp",
            }),
            y: interpolate(frame, [dropAt, 300], [toY + 52, toY + 90], {
              extrapolateRight: "clamp",
            }),
          };

  const successProgress = clamp01(
    interpolate(frame, [successAt, successAt + 18], [0, 1]),
  );

  const ctaProgress = spring({
    frame: Math.max(0, frame - ctaAt),
    fps,
    config: {damping: 14, stiffness: 100, mass: 0.7},
  });
  const ctaOpacity = interpolate(frame, [ctaAt, ctaAt + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const panX = isDragging
    ? interpolate(dragT, [0, 1], [0, -36])
    : frame >= dropAt
      ? interpolate(settle, [0, 1], [-36, 0])
      : 0;

  const headlineOpacity = interpolate(frame, [24, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(165deg, ${brand.colors.background} 0%, ${brand.colors.backgroundAccent} 55%, ${brand.colors.background} 100%)`,
        fontFamily: `"${brand.typography.fontFamily}", system-ui, sans-serif`,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 18%, rgba(255,255,255,0.14) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 70% 80%, rgba(0,0,0,0.16) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 72,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: logoOpacity,
          transform: `translateY(${logoY}px)`,
          zIndex: 10,
        }}
      >
        <Img
          src={staticFile(brand.logoSrc)}
          style={{height: 56, width: "auto"}}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 160,
          left: 64,
          right: 64,
          textAlign: "center",
          color: "#fff",
          fontSize: 34,
          fontWeight: 600,
          letterSpacing: -0.4,
          lineHeight: 1.25,
          opacity: headlineOpacity * (1 - ctaOpacity * 0.85),
        }}
      >
        {headline}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          opacity: boardOpacity,
          transform: `translate(${panX}px, ${boardY}px)`,
        }}
      >
        {columns.map((col, i) => {
          const colAppear = spring({
            frame: Math.max(0, frame - (18 + i * 6)),
            fps,
            config: {damping: 16, stiffness: 110},
          });
          const highlight =
            (isDragging && i === deal.toColumn) ||
            (frame >= dropAt && i === deal.toColumn);
          return (
            <div
              key={col.id}
              style={{
                position: "absolute",
                left: columnX(i),
                top: BOARD_TOP,
                width: columnWidth,
                height: 620,
                borderRadius: brand.radii.column,
                background: highlight
                  ? "rgba(255,255,255,0.22)"
                  : "rgba(255,255,255,0.14)",
                border: highlight
                  ? "2px solid rgba(255,255,255,0.55)"
                  : "1px solid rgba(255,255,255,0.22)",
                boxShadow: brand.shadows.board,
                padding: 12,
                opacity: colAppear,
                transform: `translateY(${interpolate(colAppear, [0, 1], [30, 0])}px) scale(${interpolate(colAppear, [0, 1], [0.96, 1])})`,
              }}
            >
              <div
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: -0.2,
                  marginBottom: 14,
                  padding: "4px 6px",
                  opacity: 0.95,
                }}
              >
                {col.title}
              </div>
            </div>
          );
        })}

        {staticCards.map((card, idx) => {
          const appear = spring({
            frame: Math.max(0, frame - (40 + idx * 7)),
            fps,
            config: {damping: 15, stiffness: 120},
          });
          const siblings = staticCards.filter((c) => c.column === card.column);
          const slotInCol =
            siblings.indexOf(card) +
            (card.column === deal.fromColumn ? 1 : 0);
          return (
            <div
              key={card.id}
              style={{
                position: "absolute",
                left: cardInColumnX(card.column),
                top: cardYInColumn(slotInCol),
                opacity: appear,
                transform: `translateY(${interpolate(appear, [0, 1], [24, 0])}px)`,
                zIndex: 2,
              }}
            >
              <DealCardView
                title={card.title}
                value={card.value}
                brand={brand}
                width={cardWidth}
                scale={interpolate(appear, [0, 1], [0.92, 1])}
              />
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: heroX,
            top: heroY,
            zIndex: isLifted || frame >= dropAt ? 30 : 5,
            opacity: spring({
              frame: Math.max(0, frame - 48),
              fps,
              config: {damping: 14, stiffness: 120},
            }),
          }}
        >
          <div style={{position: "relative"}}>
            <DealCardView
              title={deal.title}
              value={deal.value}
              company={deal.company}
              brand={brand}
              width={cardWidth}
              lifted={isLifted || (frame >= dropAt && settle < 0.95)}
              scale={heroScale}
              rotate={heroRotate}
            />
            {frame >= successAt ? (
              <SuccessBadge progress={successProgress} brand={brand} />
            ) : null}
          </div>
        </div>
      </div>

      <CursorHand
        x={cursorTarget.x}
        y={cursorTarget.y}
        pressing={press * (frame < dropAt ? 1 : 0)}
        opacity={cursorAppear * cursorExit}
        accent={brand.colors.accent}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 160,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          opacity: ctaOpacity,
          transform: `translateY(${interpolate(ctaProgress, [0, 1], [36, 0])}px)`,
          zIndex: 40,
        }}
      >
        <div
          style={{
            color: "#fff",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: -0.3,
            textAlign: "center",
            padding: "0 48px",
          }}
        >
          Feche mais negócios com {brand.name}
        </div>
        <div
          style={{
            background: brand.colors.accent,
            color: "#fff",
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: -0.2,
            padding: "18px 42px",
            borderRadius: brand.radii.button,
            boxShadow: "0 16px 36px rgba(0,0,0,0.25)",
            transform: `scale(${interpolate(ctaProgress, [0, 1], [0.9, 1])})`,
          }}
        >
          {ctaLabel}
        </div>
      </div>

      {showAudio ? (
        <>
          <Audio src={staticFile("audio/bed.mp3")} volume={0.42} />
          <Sequence from={liftStart + 6} durationInFrames={20} layout="none">
            <Audio src={staticFile("audio/sfx-lift.mp3")} volume={0.75} />
          </Sequence>
          <Sequence from={dropAt} durationInFrames={20} layout="none">
            <Audio src={staticFile("audio/sfx-drop.mp3")} volume={0.7} />
          </Sequence>
          <Sequence from={successAt} durationInFrames={24} layout="none">
            <Audio src={staticFile("audio/sfx-success.mp3")} volume={0.8} />
          </Sequence>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
