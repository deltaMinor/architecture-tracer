function isValidNodeLabel(label: string) {
    return label.startsWith("n/") && !label.includes(" ");
}

function isValidNodeId(label: string) {
    return label.startsWith("n#") && !label.includes(" ");
}

function isValidEdgeId(label: string) {
    return label.startsWith("e#") && !label.includes(" ");
}

export {
    isValidNodeLabel,
    isValidNodeId,
    isValidEdgeId
}