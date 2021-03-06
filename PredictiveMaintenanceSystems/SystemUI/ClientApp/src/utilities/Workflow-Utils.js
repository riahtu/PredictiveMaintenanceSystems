// @flow

import {type IEdge} from '../components/Edge';
import {type INode} from '../components/Node';
import fastDeepEqual from 'fast-deep-equal';

export type INodeMapNode = {
    node: INode,
    originalArrIndex: number,
    incomingEdges: IEdge[],
    outgoingEdges: IEdge[],
    parents: INode[],
    children: INode[],
};

//Assit with getting workflow information
class GraphUtils {
    static getNodesMap(nodes: any, key: string) {
        const map = {};
        const arr = Object.keys(nodes).map(key => nodes[key]);
        let item = null;

        for (let i = 0; i < arr.length; i++) {
            item = arr[i];
            map[`key-${item[key]}`] = {
                children: [],
                incomingEdges: [],
                node: item,
                originalArrIndex: i,
                outgoingEdges: [],
                parents: [],
            };
        }

        return map;
    }

    //Gets the edges on the graph
    static getEdgesMap(arr: IEdge[]) {
        const map = {};
        let item = null;

        for (let i = 0; i < arr.length; i++) {
            item = arr[i];

            if (!item.target) {
                continue;
            }

            map[`${item.source || ''}_${item.target}`] = {
                edge: item,
                originalArrIndex: i,
            };
        }

        return map;
    }

    //Find what is connected between the nodes and edges
    static linkNodesAndEdges(nodesMap: any, edges: IEdge[]) {
        let nodeMapSourceNode = null;
        let nodeMapTargetNode = null;
        let edge = null;

        for (let i = 0; i < edges.length; i++) {
            edge = edges[i];

            if (!edge.target) {
                continue;
            }

            nodeMapSourceNode = nodesMap[`key-${edge.source || ''}`];
            nodeMapTargetNode = nodesMap[`key-${edge.target}`];

            if (nodeMapSourceNode && nodeMapTargetNode) {
                nodeMapSourceNode.outgoingEdges.push(edge);
                nodeMapTargetNode.incomingEdges.push(edge);
                nodeMapSourceNode.children.push(nodeMapTargetNode);
                nodeMapTargetNode.parents.push(nodeMapSourceNode);
            }
        }
    }

    //Remove the SVG DOM
    static removeElementFromDom(id: string) {
        const container = document.getElementById(id);

        if (container && container.parentNode) {
            container.parentNode.removeChild(container);

            return true;
        }

        return false;
    }

    //Find the parent node
    static findParent(element: any, selector: string) {
        if (element && element.matches && element.matches(selector)) {
            return element;
        } else if (element && element.parentNode) {
            return GraphUtils.findParent(element.parentNode, selector);
        }

        return null;
    }

    static classNames(...args: any[]) {
        let className = '';

        for (const arg of args) {
            if (typeof arg === 'string' || typeof arg === 'number') {
                className += ` ${arg}`;
            } else if (
                typeof arg === 'object' &&
                !Array.isArray(arg) &&
                arg !== null
            ) {
                //eslint-disable-next-line
                Object.keys(arg).forEach(key => {
                    if (arg[key]) {
                        className += ` ${key}`;
                    }
                });
            } else if (Array.isArray(arg)) {
                className += ` ${arg.join(' ')}`;
            }
        }

        return className.trim();
    }

    static yieldingLoop(count, chunksize, callback, finished) {
        let i = 0;

        (function chunk() {
            const end = Math.min(i + chunksize, count);

            for (; i < end; ++i) {
                callback.call(null, i);
            }

            if (i < count) {
                setTimeout(chunk, 0);
            } else {
                finished && finished.call(null);
            }
        })();
    }

    static hasNodeShallowChanged(prevNode: INode, newNode: INode) {
        return !this.isEqual(prevNode, newNode);
    }

    static isEqual(prevNode: any, newNode: any) {
        return fastDeepEqual(prevNode, newNode);
    }
}

export default GraphUtils;
