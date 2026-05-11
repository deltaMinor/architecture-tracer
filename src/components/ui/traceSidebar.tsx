import { traceStep } from "../architectureState";

interface TraceSidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  traceSteps: traceStep[];
  currentStep: number;
  isCurrentlyTracing: boolean;
}

export function TraceSidebar({
  open,
  setOpen,
  traceSteps,
  currentStep,
  isCurrentlyTracing,
}: TraceSidebarProps) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar panel */}
      <div
        style={{
          width: open ? 260 : 0,
          minWidth: 0,
          overflow: "hidden",
          height: "100%",
          background: "#16171D",
          borderRight: open ? "1px solid #2a2b38" : "none",
          transition: "width 0.25s ease",
          display: "flex",
          flexDirection: "column",
          boxShadow: open ? "4px 0 16px rgba(0,0,0,0.4)" : "none",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 16px 12px",
            borderBottom: "1px solid #2a2b38",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "#e0e0e8",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
            }}
          >
            Trace Log
          </span>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              color: "#fff",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            Simulation trace:{" "}
            {isCurrentlyTracing ? (
              <span style={{ color: "#0f0", fontWeight: "bold" }}>on</span>
            ) : (
              <span style={{ color: "#f00", fontWeight: "bold" }}>off</span>
            )}
          </div>
          {traceSteps.length === 0 ? (
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
            [...traceSteps].map((step, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 8,
                  background: "#1e1f2b",
                  border:
                    i == currentStep && isCurrentlyTracing
                      ? "1px solid #555"
                      : "1px solid #000",
                  margin: "6px 12px",
                  padding: "10px 8px",
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: 1.25,
                  boxShadow:
                    i == currentStep && isCurrentlyTracing
                      ? "0 0 2px 2px rgba(255, 255, 255, 0.25)"
                      : "none",
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
                  trace {step.nodeId}
                  {"("}
                  {step.nodeName}
                  {")"}
                </span>
                <span
                  style={{
                    color: "#999",
                    fontSize: 12,
                  }}
                >
                  {step.description}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Trace log"
        style={{
          position: "absolute",
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
          transition: "left 0.25s ease",
          boxShadow: "-2px 0 8px rgba(0,0,0,0.3)",
        }}
      >
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
        {traceSteps.length > 0 && (
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
            {traceSteps.length}
          </span>
        )}
      </button>
    </div>
  );
}
