import {ILoggingApiService, LogEntry, LogLevel, WriteLogRequestPayload} from '@process-engine/logging_api_contracts';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IIdentity, IIdentityService} from '@essential-projects/iam_contracts';

import {Request, Response} from 'express';

export class LoggingApiController {
  public config: any = undefined;

  private httpCodeSuccessfulResponse: number = 200;
  private httpCodeSuccessfulNoContentResponse: number = 204;

  private _identityService: IIdentityService;
  private _loggingApiService: ILoggingApiService;

  constructor(identityService: IIdentityService, loggingApiService: ILoggingApiService) {
    this._identityService = identityService;
    this._loggingApiService = loggingApiService;
  }

  private get identityService(): IIdentityService {
    return this._identityService;
  }

  private get loggingApiService(): ILoggingApiService {
    return this._loggingApiService;
  }

  public async getLogsForCorrelation(request: Request, response: Response): Promise<void> {
    const correlationId: string = request.params.correlation_id;

    const identity: IIdentity = await this._resolveIdentity(request);

    const result: Array<LogEntry> = await this.loggingApiService.getLogsForCorrelation(identity, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getLogsForProcessModel(request: Request, response: Response): Promise<void> {
    const correlationId: string = request.params.correlation_id;
    const processModelId: string = request.params.process_model_id;

    const identity: IIdentity = await this._resolveIdentity(request);

    const result: Array<LogEntry> = await this.loggingApiService.getLogsForProcessModel(identity, correlationId, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async writeLogForProcessModel(request: Request, response: Response): Promise<void> {
    const correlationId: string = request.params.correlation_id;
    const processModelId: string = request.params.process_model_id;
    const payload: WriteLogRequestPayload = request.body;

    await this
      .loggingApiService
      .writeLogForProcessModel(correlationId, processModelId, payload.logLevel, payload.message, payload.timestamp);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  public async writeLogForFlowNode(request: Request, response: Response): Promise<void> {
    const correlationId: string = request.params.correlation_id;
    const processModelId: string = request.params.process_model_id;
    const flowNodeId: string = request.params.flow_node_id;
    const payload: WriteLogRequestPayload = request.body;

    await this
      .loggingApiService
      .writeLogForFlowNode(correlationId, processModelId, flowNodeId, payload.logLevel, payload.message, payload.timestamp);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  private async _resolveIdentity(request: Request): Promise<IIdentity> {
    const bearerToken: string = request.get('authorization');

    if (!bearerToken) {
      throw new UnauthorizedError('No auth token provided!');
    }

    const token: string = bearerToken.substr('Bearer '.length);
    const identity: IIdentity = await this.identityService.getIdentity(token);

    return identity;
  }
}
