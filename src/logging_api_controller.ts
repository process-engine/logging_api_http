import {ILoggingApi} from '@process-engine/logging_api_contracts';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IIdentity, IIdentityService} from '@essential-projects/iam_contracts';

import {Request, Response} from 'express';

export class LoggingApiController {

  private httpCodeSuccessfulResponse = 200;

  private identityService: IIdentityService;
  private loggingApiService: ILoggingApi;

  constructor(identityService: IIdentityService, loggingApiService: ILoggingApi) {
    this.identityService = identityService;
    this.loggingApiService = loggingApiService;
  }

  public async readLogForProcessModel(request: Request, response: Response): Promise<void> {
    const processModelId = request.params.process_model_id;

    const identity = await this.resolveIdentity(request);

    const result = await this.loggingApiService.readLogForProcessModel(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  private async resolveIdentity(request: Request): Promise<IIdentity> {
    const bearerToken = request.get('authorization');

    if (!bearerToken) {
      throw new UnauthorizedError('No auth token provided!');
    }

    const token = bearerToken.substr('Bearer '.length);
    const identity = await this.identityService.getIdentity(token);

    return identity;
  }

}
