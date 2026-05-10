import {
  Node,
  Handle,
  Position,
  NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';


type CustomNodeData = { label: string, sourceCount: number, targetCount: number };
type CustomNode = Node<CustomNodeData, 'data'>;

export default function CustomNode({ id, data }: NodeProps<CustomNode>) {
  return (
    <div style={{ position: 'relative' }}>
      {/* ID badge */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        color: 'gray',
        fontSize: '9px', fontStyle: 'italic',
        padding: '1px 4px', borderRadius: '4px',
        zIndex: 10, pointerEvents: 'none', lineHeight: '14px',
      }}>
        {id}
      </div>

      {/* Node body */}
      <div style={{
        padding: '10px 20px', borderRadius: '5px',
        background: '#fff', border: '1px solid #1a192b',
        fontSize: '12px', minWidth: 150,
      }}>
        {data.targetCount > 0 && <Handle type="target" position={Position.Top} />}
        {data.label}
        {data.sourceCount > 0 && <Handle type="source" position={Position.Bottom} />}
      </div>
    </div>
  );
}