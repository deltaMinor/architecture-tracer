import { useState } from "react";
import { ArchitectureState, nodeToString } from "../architectureState";

interface TraceSidebarProps {
  architectureState: ArchitectureState;
}

export function TraceSidebar({ architectureState }: TraceSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        title="Trace log"
        style={{
          position: "fixed",
          top: "5%",
          left: open ? 260 : 0,
          transform: "translateY(-50%)",
          zIndex: 50,
          background: "#1e1f2b",
          border: "1px solid #333",
          borderLeft: "none",
          borderRight: "1px solid #333",
          borderRadius: "0 6px 6px 0",
          padding: "10px 8px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          transition: "left 0.25s ease",
          boxShadow: "-2px 0 8px rgba(0,0,0,0.3)",
        }}
      >
        {/* "Tr" icon */}
        <span
          style={{
            fontFamily: "ui-monospace, monospace",
            fontWeight: 700,
            fontSize: 13,
            color: "#83848C",
            letterSpacing: "-0.5px",
            lineHeight: 1,
          }}
        >
          Tr
        </span>
        {architectureState.getTraceSteps().length > 0 && (
          <span
            style={{
              background: "#777",
              color: "#fff",
              borderRadius: "9999px",
              fontSize: 10,
              fontWeight: 700,
              minWidth: 16,
              height: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
            }}
          >
            {architectureState.getTraceSteps().length}
          </span>
        )}
      </button>

      {/* Sidebar panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          width: 260,
          background: "#16171D",
          borderRight: "1px solid #2a2b38",
          zIndex: 49,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-4px 0 16px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 16px 12px",
            borderBottom: "1px solid #2a2b38",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              color: "#e0e0e8",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            Trace Log
          </span>
        </div>

        {/* Entries */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px 0",
          }}
        >
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              color: "#fff",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            Simulation trace:{" "}
            {architectureState.isCurrentlyTracing() ? (
              <span style={{ color: "#0f0", fontWeight: "bold" }}>on</span>
            ) : (
              <span style={{ color: "#f00", fontWeight: "bold" }}>off</span>
            )}
          </div>
          {architectureState.getTraceSteps().length === 0 ? (
            <div
              style={{
                color: "#555",
                fontSize: 12,
                textAlign: "center",
                marginTop: 24,
                fontStyle: "italic",
              }}
            >
              Trace log is currently empty.
            </div>
          ) : (
            [...architectureState.getTraceSteps()].reverse().map((step) => (
              <div
                style={{
                  padding: "8px 14px",
                  borderBottom: "1px solid #1e1f2b",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <span
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  trace{" "}
                  {nodeToString(architectureState.getNodeWithId(step.nodeId))}
                </span>
                <span
                  style={{
                    color: "#555",
                    fontSize: 10,
                  }}
                >
                  {step.description}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
