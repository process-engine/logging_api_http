import {ILoggingApi, LogEntry} from '@process-engine/logging_api_contracts';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IIdentity, IIdentityService} from '@essential-projects/iam_contracts';

import {Request, Response} from 'express';

export class LoggingApiController {
  public config: any = undefined;

  private httpCodeSuccessfulResponse: number = 200;

  private _identityService: IIdentityService;
  private _loggingApiService: ILoggingApi;

  constructor(identityService: IIdentityService, loggingApiService: ILoggingApi) {
    this._identityService = identityService;
    this._loggingApiService = loggingApiService;
  }

  private get identityService(): IIdentityService {
    return this._identityService;
  }

  private get loggingApiService(): ILoggingApi {
    return this._loggingApiService;
  }

  public async readLogForCorrelation(request: Request, response: Response): Promise<void> {
    const correlationId: string = request.params.correlation_id;

    const identity: IIdentity = await this._resolveIdentity(request);

    const result: Array<LogEntry> = await this.loggingApiService.readLogForCorrelation(identity, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async readLogForProcessModel(request: Request, response: Response): Promise<void> {
    const correlationId: string = request.params.correlation_id;
    const processModelId: string = request.params.process_model_id;

    const identity: IIdentity = await this._resolveIdentity(request);

    const result: Array<LogEntry> = await this.loggingApiService.readLogForProcessModel(identity, correlationId, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
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
