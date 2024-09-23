export enum MessageTypeWithId {
    // real time api messages
    AuthenticateRequest = 1,
    AuthenticateResponse = 2,
    TextMessage = 3,

    // chain stuff
    Tick = 100,
    SystemInfo = 101,

    // Mining stuff
    RandomMiningSeed = 200,

    // logging stuff
    QuTransfer = 300,
    AssetIssuance = 301,
    AssetOwnershipChange = 302,
    AssetPossessionChange = 303,
    ContractError = 304,
    ContractWarning = 305,
    ContractInfo = 306,
    ContractDebug = 307,
    Burning = 308,

    // none
    None = 999
}

export enum MessageType {
    // real time api messages
    AuthenticateRequest,
    AuthenticateResponse,
    TextMessage,

    // chain stuff
    Tick,
    SystemInfo,

    // Mining stuff
    RandomMiningSeed,

    // logging stuff
    QuTransfer,
    AssetIssuance,
    AssetOwnershipChange,
    AssetPossessionChange,
    ContractError,
    ContractWarning,
    ContractInfo,
    ContractDebug,
    Burning,

    // none
    None
}
