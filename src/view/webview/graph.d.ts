import { GraphData } from '../view';

export interface Window {
  messageQueue: Array<{
    type: string;
    data: GraphData;
  }>;
}
