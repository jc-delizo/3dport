import { useEffect, useMemo, useState } from 'react'
import {
  Background,
  BackgroundVariant,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
} from '@xyflow/react'
import { Braces, MessageSquareText, Rocket, ShieldCheck } from 'lucide-react'
import '@xyflow/react/dist/style.css'

const steps = [
  {
    id: 'conversation',
    number: '01',
    title: 'Conversation',
    note: 'Intent and context enter',
    icon: MessageSquareText,
  },
  {
    id: 'structured',
    number: '02',
    title: 'Structured work',
    note: 'Context becomes action',
    icon: Braces,
  },
  {
    id: 'approval',
    number: '03',
    title: 'Human approval',
    note: 'Judgment stays in-loop',
    icon: ShieldCheck,
  },
  {
    id: 'delivery',
    number: '04',
    title: 'Delivery',
    note: 'Approved work moves',
    icon: Rocket,
  },
]

const edgeLabels = ['shape', 'review', 'release']

function DeliveryNode({ data }) {
  const Icon = data.icon

  return (
    <div className={`delivery-flow-node ${data.gate ? 'delivery-flow-node-gate' : ''}`}>
      <Handle id="target" type="target" position={data.targetPosition} />
      <div className="delivery-flow-node-topline">
        <span className="delivery-flow-node-icon"><Icon aria-hidden="true" /></span>
        <span className="delivery-flow-node-number">{data.number}</span>
      </div>
      <strong>{data.title}</strong>
      <small>{data.note}</small>
      {data.gate ? <em>Decision gate</em> : null}
      <Handle id="source" type="source" position={data.sourcePosition} />
    </div>
  )
}

const nodeTypes = { delivery: DeliveryNode }

function FallbackFlow() {
  return (
    <ol className="grid gap-2 p-5 sm:grid-cols-4">
      {steps.map((step) => {
        const Icon = step.icon
        return (
          <li key={step.id} className="rounded-xl border border-hairline bg-card p-3 text-center">
            <Icon aria-hidden="true" className="mx-auto h-4 w-4 text-accent" />
            <span className="mt-2 block font-mono text-[10px] text-accent">{step.number}</span>
            <p className="mt-1 text-label font-medium">{step.title}</p>
          </li>
        )
      })}
    </ol>
  )
}

export function DeliveryFlow() {
  const [vertical, setVertical] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(max-width: 767px)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia?.('(max-width: 767px)')
    if (!query) return undefined
    const update = (event) => setVertical(event.matches)
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])

  const nodes = useMemo(
    () =>
      steps.map((step, index) => ({
        id: step.id,
        type: 'delivery',
        position: vertical ? { x: 20, y: index * 170 } : { x: index * 265, y: 44 },
        data: {
          ...step,
          gate: step.id === 'approval',
          targetPosition: vertical ? Position.Top : Position.Left,
          sourcePosition: vertical ? Position.Bottom : Position.Right,
        },
        draggable: false,
        selectable: false,
      })),
    [vertical],
  )

  const edges = useMemo(
    () =>
      steps.slice(0, -1).map((step, index) => ({
        id: `${step.id}-${steps[index + 1].id}`,
        source: step.id,
        target: steps[index + 1].id,
        sourceHandle: 'source',
        targetHandle: 'target',
        type: 'straight',
        label: vertical ? undefined : edgeLabels[index],
        labelStyle: {
          fill: 'rgb(var(--color-muted))',
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        },
        labelBgStyle: { fill: 'rgb(var(--color-canvas))', fillOpacity: 0.96 },
        labelBgPadding: [7, 4],
        labelBgBorderRadius: 10,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: 'rgb(var(--color-accent))' },
        style: { stroke: 'rgb(var(--color-accent))' },
        className: 'delivery-flow-edge',
      })),
    [vertical],
  )

  return (
    <div
      role="img"
      aria-label="Conversation becomes structured work, passes through human approval, and moves into delivery."
      className="delivery-flow overflow-hidden rounded-card border border-hairline bg-canvas"
    >
      <div className="flex items-center justify-between border-b border-hairline px-4 py-3 md:px-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Delivery control plane
        </span>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" /> Human gate enforced
        </span>
      </div>
      <div className="delivery-flow-canvas">
        {typeof ResizeObserver === 'undefined' ? (
          <FallbackFlow />
        ) : (
          <ReactFlow
            aria-hidden="true"
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: vertical ? 0.12 : 0.08 }}
            minZoom={0.2}
            maxZoom={1.2}
            nodesDraggable={false}
            nodesConnectable={false}
            nodesFocusable={false}
            edgesFocusable={false}
            elementsSelectable={false}
            panOnDrag={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            preventScrolling={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1.15} />
          </ReactFlow>
        )}
      </div>
      <p className="border-t border-hairline px-4 py-2 text-center font-mono text-[10px] uppercase tracking-widest text-muted">
        High-level system view · No proprietary interface shown
      </p>
    </div>
  )
}
