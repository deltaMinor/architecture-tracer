function isValidNodeLabel(label: string) {
    return label.startsWith("n/");
}

function isValidNodeId(id: string) {
    return id.startsWith("n#") && !isNaN(+id.substring(2));
}

export {
    isValidNodeLabel,
    isValidNodeId
}