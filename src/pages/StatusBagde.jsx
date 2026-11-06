// status badge colors

const badgeColors = {
  "Pending": {
     bg: "rgba(255, 193, 7, 0.15)",
     text: "#ffd166",
    border: "1px solid rgba(255, 209, 102, 0.4)"
  },
  "Assigned": {
    bg: "rgba(229, 212, 184, 0.15)",
     text: "#e5d4b8",
    border: "1px solid rgba(229, 212, 184, 0.4)"
  },
  "Accepted": {
     bg: "rgba(13, 202, 240, 0.15)",
    text: "#70e0f2",
     border: "1px solid rgba(13, 202, 240, 0.4)"
  },
  "Declined": {
    bg: "rgba(235, 87, 87, 0.15)",
     text: "#ff7b7b",
    border: "1px solid rgba(235, 87, 87, 0.4)"
  },
  "Picked Up": {
     bg: "rgba(102, 126, 234, 0.18)",
    text: "#a3b8ff",
     border: "1px solid rgba(102, 126, 234, 0.45)"
  },
  "In Transit": {
    bg: "rgba(255, 78, 0, 0.18)",
     text: "#ff7033",
    border: "1px solid rgba(255, 78, 0, 0.45)"
  },
  "Delivered": {
     bg: "rgba(40, 167, 69, 0.18)",
    text: "#7fe39a",
     border: "1px solid rgba(40, 167, 69, 0.45)"
  },
  "Cancelled": {
    bg: "rgba(235, 87, 87, 0.15)",
     text: "#ff7b7b",
    border: "1px solid rgba(235, 87, 87, 0.4)"
  }
} ;


function StatusBadge({ status }) {
   const name = status || "Pending" ;
  const s = badgeColors[name] || {
     bg: "rgba(229, 212, 184, 0.1)",
    text: "#e5d4b8",
     border: "1px solid rgba(229, 212, 184, 0.2)"
  }

  return (
    <span
       className="badge rounded-pill fw-semibold px-2 py-1"
      style={{
        backgroundColor: s.bg,
         color: s.text,
        border: s.border,
         fontSize: "12px",
        textTransform: "lowercase"
      }}
    >
       {name}
    </span>
  )
}

export default StatusBadge
