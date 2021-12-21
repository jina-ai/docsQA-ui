export interface DenseNDArray {
    buffer?: string;
    shape: number[];
    dtype: string;
}
export interface SparseNDArray {
    indices?: DenseNDArray;
    values?: DenseNDArray;
    shape: number[];
}
export interface NDArray {
    dense?: DenseNDArray;
    sparse?: SparseNDArray;
    clsName: string;
    parameters?: {
        [k: string]: any;
    };
}
export interface Graph {
    adjacency?: NDArray;
    edgeFeatures?: {
        [k: string]: any;
    };
    undirected: boolean;
}
export interface NamedScore {
    value: number;
    opName: string;
    description: string;
    operands: NamedScore[];
    refId: string;
}
export interface Document {
    id: string;
    granularity: number;
    adjacency: number;
    parentId: string;
    buffer?: string;
    blob?: NDArray;
    text: string;
    graph?: Graph;
    chunks: Document[];
    weight: number;
    matches: Document[];
    uri: string;
    mimeType: string;
    tags: {
        [k: string]: any;
    };
    location: number[];
    offset: number;
    embedding?: NDArray;
    scores: {
        [k: string]: NamedScore;
    };
    modality: string;
    evaluations: {
        [k: string]: NamedScore;
    };
}
export interface DocumentArray<T extends Document = Document> extends Array<T> {
}
