import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style = {},
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
 
  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? "#6366f1" : "#94a3b8",
          strokeWidth: selected ? 2.5 : 1.8,
          transition: "stroke 0.2s, stroke-width 0.2s",
          ...style,
        }}
      />
 
      {/* ID badge rendered via EdgeLabelRenderer — not the label prop */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 7px",
              color: "white",
              fontSize: "9px",
              fontStyle: "italic",
              fontWeight: 500,
              transition: "all 0.2s",
              userSelect: "none",
              whiteSpace: "nowrap",
              textShadow: "0px 0px 1px #000000"
            }}
          >
            {id}
          </span>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
