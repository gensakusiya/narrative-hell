import React from 'react';
import type { NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';
import type { BeatWithValidation } from 'shared';

import styles from './node.module.css';

export function BeatNode({ data, selected }: NodeProps): React.ReactElement {
  const nodeData = data as unknown as BeatWithValidation;
  const { name, transitions, goto, isStart, isEnd, isUnreachable, hasError } =
    nodeData;
  const hasContent = transitions.length > 0 || Object.keys(goto).length > 0;

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

  const headerClasses = [styles.header];
  if (hasContent) {
    headerClasses.push(styles.line);
  }

  const contentElement = hasContent ? (
    <div className={styles.content}>
      {/* Additional content can be rendered here */}
    </div>
  ) : null;

  return (
    <div className={getStatusClasses()}>
      <div className={headerClasses.join(' ')}>{name}</div>
      {contentElement}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
