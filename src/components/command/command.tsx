import {
    BuiltInEdge,
    ReactFlowInstance,
    useReactFlow,
    type Node
} from '@xyflow/react'; 

abstract class Command {
    abstract execute(reactFlow: ReactFlowInstance): string;
}

function addNode (node: Node) {
    const { setNodes } = useReactFlow<Node, BuiltInEdge>();

    setNodes((prev) => [...prev, node]);
}

class AddNodeCommand extends Command {
    private newNodeLabel: string;

    constructor(label: string) {
        super();
        this.newNodeLabel = label;
    }

    execute(reactFlow: ReactFlowInstance) {
        var newId = 1;
        var position = {x: 0, y: 0};
        for (var node of reactFlow.getNodes()) {
            if(node.id == "n#" + newId.toString()) {
                newId += 1;
            }
            position.x += node.position.x;
            position.y += node.position.y;
        }
        var nodeCount = reactFlow.getNodes().length;
        const newNode = {
            id: "n#" + newId.toString(),
            type: 'customNode',
            position: { x: position.x/nodeCount, y: position.y/nodeCount },
            data: { label: this.newNodeLabel },
        };
        reactFlow.setNodes((prev) => [...prev, newNode]);
        return `Node ${this.newNodeLabel} added(id: ${newNode.id}).`;
    }
}

export {
    Command,
    AddNodeCommand
}