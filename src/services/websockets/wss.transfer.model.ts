export interface BaseMessage {
    MessageType: string;
}

export interface QuTransferMessage extends BaseMessage {
    Tick: number;
    LogId: number;
    LogDigest: number;
    Amount: number;
    DestinationAddress: string;
    SourceAddress: string;
}

export interface RandomMiningSeedMessage extends BaseMessage {
    Seed: string;
}

export interface TickMessage extends BaseMessage {
    Tick: number;
}