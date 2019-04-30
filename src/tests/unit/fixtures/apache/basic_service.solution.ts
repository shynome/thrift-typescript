export interface IPingArgsArgs {
}
export class PingArgs {
    constructor() {
    }
    public write(output: thrift.TProtocol): void {
        output.writeStructBegin("PingArgs");
        output.writeFieldStop();
        output.writeStructEnd();
        return;
    }
    public static read(input: thrift.TProtocol): PingArgs {
        input.readStructBegin();
        while (true) {
            const ret: thrift.TField = input.readFieldBegin();
            const fieldType: thrift.Thrift.Type = ret.ftype;
            const fieldId: number = ret.fid;
            if (fieldType === thrift.Thrift.Type.STOP) {
                break;
            }
            switch (fieldId) {
                default: {
                    input.skip(fieldType);
                }
            }
            input.readFieldEnd();
        }
        input.readStructEnd();
        return new PingArgs();
    }
}
export interface IPingResultArgs {
    success?: void;
}
export class PingResult {
    public success?: void;
    constructor(args?: IPingResultArgs) {
        if (args != null && args.success != null) {
            this.success = args.success;
        }
    }
    public write(output: thrift.TProtocol): void {
        output.writeStructBegin("PingResult");
        output.writeFieldStop();
        output.writeStructEnd();
        return;
    }
    public static read(input: thrift.TProtocol): PingResult {
        input.readStructBegin();
        let _args: any = {};
        while (true) {
            const ret: thrift.TField = input.readFieldBegin();
            const fieldType: thrift.Thrift.Type = ret.ftype;
            const fieldId: number = ret.fid;
            if (fieldType === thrift.Thrift.Type.STOP) {
                break;
            }
            switch (fieldId) {
                case 0:
                    if (fieldType === thrift.Thrift.Type.VOID) {
                        input.skip(fieldType);
                    }
                    else {
                        input.skip(fieldType);
                    }
                    break;
                default: {
                    input.skip(fieldType);
                }
            }
            input.readFieldEnd();
        }
        input.readStructEnd();
        return new PingResult(_args);
    }
}
export class Client {
    public _requestId: number;
    public _reqs: {
        [name: number]: (err: Error | object | undefined, val?: any) => void;
    };
    public output: thrift.TTransport;
    public protocol: new (trans: thrift.TTransport) => thrift.TProtocol;
    constructor(output: thrift.TTransport, protocol: new (trans: thrift.TTransport) => thrift.TProtocol) {
        this._requestId = 0;
        this._reqs = {};
        this.output = output;
        this.protocol = protocol;
    }
    public incrementRequestId(): number {
        return this._requestId += 1;
    }
    public ping(): Promise<void> {
        const requestId: number = this.incrementRequestId();
        return new Promise<void>((resolve, reject): void => {
            this._reqs[requestId] = (error, result) => {
                delete this._reqs[requestId];
                if (error != null) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            };
            this.send_ping(requestId);
        });
    }
    public send_ping(requestId: number): void {
        const output: thrift.TProtocol = new this.protocol(this.output);
        output.writeMessageBegin("ping", thrift.Thrift.MessageType.CALL, requestId);
        const args: PingArgs = new PingArgs();
        args.write(output);
        output.writeMessageEnd();
        this.output.flush();
        return;
    }
    public recv_ping(input: thrift.TProtocol, mtype: thrift.Thrift.MessageType, requestId: number): void {
        const noop = (): any => null;
        const callback = this._reqs[requestId] || noop;
        if (mtype === thrift.Thrift.MessageType.EXCEPTION) {
            const x: thrift.Thrift.TApplicationException = new thrift.Thrift.TApplicationException();
            x.read(input);
            input.readMessageEnd();
            return callback(x);
        }
        else {
            input.readMessageEnd();
            return callback(undefined);
        }
    }
}
export interface IHandler {
    ping(): void | Promise<void>;
}
export class Processor {
    public handler: IHandler;
    constructor(handler: IHandler) {
        this.handler = handler;
    }
    public process(input: thrift.TProtocol, output: thrift.TProtocol): void {
        const metadata: thrift.TMessage = input.readMessageBegin();
        const fieldName: string = metadata.fname;
        const requestId: number = metadata.rseqid;
        switch (fieldName) {
            case "ping": {
                this.process_ping(requestId, input, output);
                return;
            }
            default: {
                input.skip(thrift.Thrift.Type.STRUCT);
                input.readMessageEnd();
                const errMessage = "Unknown function " + fieldName;
                const err = new thrift.Thrift.TApplicationException(thrift.Thrift.TApplicationExceptionType.UNKNOWN_METHOD, errMessage);
                output.writeMessageBegin(fieldName, thrift.Thrift.MessageType.EXCEPTION, requestId);
                err.write(output);
                output.writeMessageEnd();
                output.flush();
                return;
            }
        }
    }
    public process_ping(requestId: number, input: thrift.TProtocol, output: thrift.TProtocol): void {
        new Promise<void>((resolve, reject): void => {
            try {
                input.readMessageEnd();
                resolve(this.handler.ping());
            }
            catch (err) {
                reject(err);
            }
        }).then((data: void): void => {
            const result: PingResult = new PingResult({ success: data });
            output.writeMessageBegin("ping", thrift.Thrift.MessageType.REPLY, requestId);
            result.write(output);
            output.writeMessageEnd();
            output.flush();
            return;
        }).catch((err: Error): void => {
            const result: thrift.Thrift.TApplicationException = new thrift.Thrift.TApplicationException(thrift.Thrift.TApplicationExceptionType.UNKNOWN, err.message);
            output.writeMessageBegin("ping", thrift.Thrift.MessageType.EXCEPTION, requestId);
            result.write(output);
            output.writeMessageEnd();
            output.flush();
            return;
        });
    }
}
