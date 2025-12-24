import { useEffect, useRef } from "react"
import ForceGraph from "force-graph"
import "./popup.css"

function IndexPopup() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const width = 360
    const height = 360

    // 🔑 TypeScript fix: tell TS this is callable
    const fg = (ForceGraph as any)()(ref.current)

    fg.width(width)
      .height(height)
      .backgroundColor("#111")
      .nodeColor(() => "orange")
      .linkColor(() => "#888")
      .graphData({
        nodes: [
          { id: "A" },
          { id: "B" },
          { id: "C" }
        ],
        links: [
          { source: "A", target: "B" },
          { source: "B", target: "C" }
        ]
      })

    return () => {
      fg._destructor?.()
    }
  }, [])

  return <div ref={ref} />
}

export default IndexPopup
