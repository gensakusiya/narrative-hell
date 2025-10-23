import React from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';

import { Beat } from '../../../types/beat';

import styles from './node.module.css';

export function BeatNode({ data }: NodeProps): React.ReactElement {
  const beatData = data as unknown as Beat;

  return (
    <div className={styles.node}>
      <Handle type="target" position={Position.Left} />
      <div>
        <span>{beatData.name}</span>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
