import React from 'react';
import type { NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';
import type { BeatWithValidation } from 'shared';

import styles from './node.module.css';

export function BeatNode({ data, selected }: NodeProps): React.ReactElement {
  const nodeData = data as unknown as BeatWithValidation;
  const { name, isStart, isEnd, isUnreachable, hasError } = nodeData;

  const getStatusClasses = (): string => {
    const baseClasses = [styles.node];

    if (isStart) {
      baseClasses.push(styles.start);
    } else if (isEnd) {
      baseClasses.push(styles.end);
    } else if (isUnreachable) {
      baseClasses.push(styles.unreachable);
    } else if (hasError) {
      baseClasses.push(styles.error);
    } else {
      baseClasses.push(styles.normal);
    }

    if (selected) {
      baseClasses.push(styles.selected);
    }

    return baseClasses.join(' ');
  };

  return (
    <div className={getStatusClasses()}>
      <Handle type="target" position={Position.Left} />

      <div className={styles.nodeContent}>
        <div className={styles.nodeName}>{name}</div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
}
