import {ILoggingService, LogEntry, LogLevel, WriteLogRequestPayload} from '@process-engine/logging_api_contracts';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IIdentity, IIdentityService} from '@essential-projects/iam_contracts';

import {Request, Response} from 'express';

export class LoggingApiController {
  public config: any = undefined;

  private httpCodeSuccessfulResponse: number = 200;
  private httpCodeSuccessfulNoContentResponse: number = 204;

  private _identityService: IIdentityService;
  private _loggingApiService: ILoggingService;

  constructor(identityService: IIdentityService, loggingApiService: ILoggingService) {
    this._identityService = identityService;
    this._loggingApiService = loggingApiService;
  }

  private get identityService(): IIdentityService {
    return this._identityService;
  }

  private get loggingApiService(): ILoggingService {
    return this._loggingApiService;
  }

  public async getLogsForCorrelation(request: Request, response: Response): Promise<void> {
    const correlationId: string = request.params.correlation_id;
    const logLevel: LogLevel = request.query.log_level;

    const identity: IIdentity = await this._resolveIdentity(request);

    const result: Array<LogEntry> = await this.loggingApiService.getLogsForCorrelation(identity, correlationId, logLevel);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getLogsForProcessInstance(request: Request, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_id;
    const correlationId: string = request.params.correlation_id;
    const logLevel: LogLevel = request.query.log_level;

    const identity: IIdentity = await this._resolveIdentity(request);

    const result: Array<LogEntry> = await this.loggingApiService.getLogsForProcessInstance(identity, processModelId, correlationId, logLevel);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async writeLogForProcessModel(request: Request, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_id;
    const correlationId: string = request.params.correlation_id;
    const payload: WriteLogRequestPayload = request.body;

    await this.loggingApiService.writeLogForProcessModel(processModelId, correlationId, payload.logLevel, payload.message);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  public async writeLogForFlowNodeInstance(request: Request, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_id;
    const correlationId: string = request.params.correlation_id;
    const flowNodeInstanceId: string = request.params.flow_node_instance_id;
    const payload: WriteLogRequestPayload = request.body;

    await this.loggingApiService.writeLogForFlowNodeInstance(processModelId, correlationId, flowNodeInstanceId, payload.logLevel, payload.message);

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
