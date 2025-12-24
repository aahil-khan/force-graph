import { useEffect, useRef } from "react"
import ForceGraph from "force-graph"
import "./popup.css"

function IndexPopup() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    let hoveredNode: any = null
    const nodeScales = new Map()

    const fg = (ForceGraph as any)()(ref.current)
      .width(360)
      .height(360)
      .backgroundColor("#1a1a1a")

      // ── Physics ────────────────────────────────────────────
      .d3AlphaDecay(0.05)
      .d3VelocityDecay(0.4)

      // ── Nodes ──────────────────────────────────────────────
      .nodeId("id")
      .nodeRelSize(2)
      .nodeVal((node: any) => {
        const currentScale = nodeScales.get(node.id) || 1
        return node === hoveredNode ? 1.9 : currentScale
      })
      .nodeColor(() => "#6a7dff")

      // ── Links ──────────────────────────────────────────────
      .linkColor(() => "rgba(100,100,150,0.3)")
      .linkWidth(0.8)

      // ── Hover tracking ─────────────────────────────────────
      .onNodeHover((node: any) => {
        hoveredNode = node
        document.body.style.cursor = node ? "pointer" : "default"
        
        // Animate scale
        const animate = () => {
          let needsUpdate = false
          
          fg.graphData().nodes.forEach((n: any) => {
            const targetScale = n === hoveredNode ? 1.9 : 1
            const currentScale = nodeScales.get(n.id) || 1
            
            if (Math.abs(currentScale - targetScale) > 0.01) {
              const newScale = currentScale + (targetScale - currentScale) * 0.2
              nodeScales.set(n.id, newScale)
              needsUpdate = true
            } else {
              nodeScales.set(n.id, targetScale)
            }
          })
          
          if (needsUpdate) {
            fg.nodeVal((n: any) => nodeScales.get(n.id) || 1)
            requestAnimationFrame(animate)
          }
        }
        
        animate()
      })

      // ── Labels ─────────────────────────────────────────────
      .nodeCanvasObjectMode(() => "after")
      .nodeCanvasObject(
        (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const label = node.id
          const isHovered = node === hoveredNode
          const scale = nodeScales.get(node.id) || 1

          const fontSize = 6 + (scale * 2)
          const opacity = 0.5 + (scale - 1) * 0.35
          const yOffset = -10 - (scale - 1) * 3

          ctx.font = `${fontSize}px system-ui, sans-serif`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"

          // Dark halo
          ctx.strokeStyle = `rgba(0,0,0,${0.5 + opacity * 0.3})`
          ctx.lineWidth = 2 + scale * 0.5
          ctx.strokeText(label, node.x, node.y + yOffset)

          // Text
          ctx.fillStyle = `rgba(220,220,250,${opacity})`
          ctx.fillText(label, node.x, node.y + yOffset)
        }
      )

    // ── Graph data ───────────────────────────────────────────
    fg.graphData({
      nodes: [
        { id: "Algorithms" },
        { id: "Graphs" },
        { id: "Trees" },
        { id: "DFS" },
        { id: "BFS" },
        { id: "Dynamic Programming" }
      ],
      links: [
        { source: "Algorithms", target: "Graphs" },
        { source: "Algorithms", target: "Trees" },
        { source: "Graphs", target: "DFS" },
        { source: "Graphs", target: "BFS" },
        { source: "Algorithms", target: "Dynamic Programming" }
      ]
    })

    return () => fg._destructor?.()
  }, [])

  return <div ref={ref} />
}

export default IndexPopup