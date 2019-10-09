/* tslint:disable */
/* eslint-disable */
/*
 * Autogenerated by @creditkarma/thrift-typescript v{{VERSION}}
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
*/
import * as thrift from "test-lib";
import * as SharedStruct from "./SharedStruct";
export interface IGetStructArgsArgs {
    key: number;
}
export class GetStructArgs {
    public key: number;
    constructor(args: IGetStructArgsArgs) {
        if (args != null && args.key != null) {
            this.key = args.key;
        }
        else {
            throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, "Required field[key] is unset!");
        }
    }
    public write(output: thrift.TProtocol): void {
        output.writeStructBegin("GetStructArgs");
        if (this.key != null) {
            output.writeFieldBegin("key", thrift.Thrift.Type.I32, 1);
            output.writeI32(this.key);
            output.writeFieldEnd();
        }
        output.writeFieldStop();
        output.writeStructEnd();
        return;
    }
    public static read(input: thrift.TProtocol): GetStructArgs {
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
                case 1:
                    if (fieldType === thrift.Thrift.Type.I32) {
                        const value_1: number = input.readI32();
                        _args.key = value_1;
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
        if (_args.key !== undefined) {
            return new GetStructArgs(_args);
        }
        else {
            throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, "Unable to read GetStructArgs from input");
        }
    }
}
export interface IGetStructResultArgs {
    success?: SharedStruct.SharedStruct;
}
export class GetStructResult {
    public success?: SharedStruct.SharedStruct;
    constructor(args?: IGetStructResultArgs) {
        if (args != null && args.success != null) {
            this.success = args.success;
        }
    }
    public write(output: thrift.TProtocol): void {
        output.writeStructBegin("GetStructResult");
        if (this.success != null) {
            output.writeFieldBegin("success", thrift.Thrift.Type.STRUCT, 0);
            this.success.write(output);
            output.writeFieldEnd();
        }
        output.writeFieldStop();
        output.writeStructEnd();
        return;
    }
    public static read(input: thrift.TProtocol): GetStructResult {
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
                    if (fieldType === thrift.Thrift.Type.STRUCT) {
                        const value_2: SharedStruct.SharedStruct = SharedStruct.SharedStruct.read(input);
                        _args.success = value_2;
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
        return new GetStructResult(_args);
    }
}
export class Client {
    public _seqid: number;
    public _reqs: {
        [name: number]: (err: Error | object | undefined, val?: any) => void;
    };
    public output: thrift.TTransport;
    public protocol: new (trans: thrift.TTransport) => thrift.TProtocol;
    constructor(output: thrift.TTransport, protocol: new (trans: thrift.TTransport) => thrift.TProtocol) {
        this._seqid = 0;
        this._reqs = {};
        this.output = output;
        this.protocol = protocol;
    }
    public incrementSeqId(): number {
        return this._seqid += 1;
    }
    public getStruct(key: number): Promise<SharedStruct.SharedStruct> {
        const requestId: number = this.incrementSeqId();
        return new Promise<SharedStruct.SharedStruct>((resolve, reject): void => {
            this._reqs[requestId] = (error, result) => {
                delete this._reqs[requestId];
                if (error != null) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            };
            this.send_getStruct(key, requestId);
        });
    }
    public send_getStruct(key: number, requestId: number): void {
        const output: thrift.TProtocol = new this.protocol(this.output);
        output.writeMessageBegin("getStruct", thrift.Thrift.MessageType.CALL, requestId);
        const args: GetStructArgs = new GetStructArgs({ key });
        args.write(output);
        output.writeMessageEnd();
        this.output.flush();
        return;
    }
    public recv_getStruct(input: thrift.TProtocol, mtype: thrift.Thrift.MessageType, requestId: number): void {
        const noop = (): any => null;
        const callback = this._reqs[requestId] || noop;
        if (mtype === thrift.Thrift.MessageType.EXCEPTION) {
            const x: thrift.Thrift.TApplicationException = new thrift.Thrift.TApplicationException();
            x.read(input);
            input.readMessageEnd();
            return callback(x);
        }
        else {
            const result: GetStructResult = GetStructResult.read(input);
            input.readMessageEnd();
            if (result.success != null) {
                return callback(undefined, result.success);
            }
            else {
                return callback(new thrift.Thrift.TApplicationException(thrift.Thrift.TApplicationExceptionType.UNKNOWN, "getStruct failed: unknown result"));
            }
        }
    }
}
export interface IHandler<Context = any> {
    getStruct(key: number, context?: Context): SharedStruct.SharedStruct | Promise<SharedStruct.SharedStruct>;
}
export class Processor<Context = any> {
    public _handler: IHandler<Context>;
    constructor(handler: IHandler<Context>) {
        this._handler = handler;
    }
    public process(input: thrift.TProtocol, output: thrift.TProtocol, context: Context): void {
        const metadata: thrift.TMessage = input.readMessageBegin();
        const fname: string = metadata.fname;
        const requestId: number = metadata.rseqid;
        const methodName: string = "process_" + fname;
        switch (methodName) {
            case "process_getStruct": {
                this.process_getStruct(requestId, input, output, context);
                return;
            }
            default: {
                input.skip(thrift.Thrift.Type.STRUCT);
                input.readMessageEnd();
                const errMessage = "Unknown function " + fname;
                const err = new thrift.Thrift.TApplicationException(thrift.Thrift.TApplicationExceptionType.UNKNOWN_METHOD, errMessage);
                output.writeMessageBegin(fname, thrift.Thrift.MessageType.EXCEPTION, requestId);
                err.write(output);
                output.writeMessageEnd();
                output.flush();
                return;
            }
        }
    }
    public process_getStruct(requestId: number, input: thrift.TProtocol, output: thrift.TProtocol, context: Context): void {
        new Promise<SharedStruct.SharedStruct>((resolve, reject): void => {
            try {
                const args: GetStructArgs = GetStructArgs.read(input);
                input.readMessageEnd();
                resolve(this._handler.getStruct(args.key, context));
            }
            catch (err) {
                reject(err);
            }
        }).then((data: SharedStruct.SharedStruct): void => {
            const result: GetStructResult = new GetStructResult({ success: data });
            output.writeMessageBegin("getStruct", thrift.Thrift.MessageType.REPLY, requestId);
            result.write(output);
            output.writeMessageEnd();
            output.flush();
            return;
        }).catch((err: Error): void => {
            const result: thrift.Thrift.TApplicationException = new thrift.Thrift.TApplicationException(thrift.Thrift.TApplicationExceptionType.UNKNOWN, err.message);
            output.writeMessageBegin("getStruct", thrift.Thrift.MessageType.EXCEPTION, requestId);
            result.write(output);
            output.writeMessageEnd();
            output.flush();
            return;
        });
    }
}
