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

export interface SystemInfoMessage extends BaseMessage {
    QubicSystemInfo: {
        Version: number;
        Epoch: number;
        Tick: number;
        InitialTick: number;
        LatestCreatedTick: number;
        EpochBeginningMillisecond: number;
        EpochBeginningSecond: number;
        EpochBeginningMinute: number;
        EpochBeginningHour: number;
        EpochBeginningDay: number;
        EpochBeginningMonth: number;
        EpochBeginningYear: number;
        NumberOfEntities: number;
        NumberOfTransactions: number;
        RandomMiningSeed: string;
        SolutionThreshold: number;
    };
}